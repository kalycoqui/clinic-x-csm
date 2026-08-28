// GET  /api/clients  -> list all non-archived clients (roster order)
// POST /api/clients  -> create a new client (name + stage), append to roster
import { json, preflight } from "../../_shared/cors.js";
import {
  ROSTER_KEY,
  CLIENT_ORDER,
  INITIAL_STAGE,
  MANUAL_V,
  SYNC_V,
  migrateManualFields,
  defaultClient,
  checklistTemplate,
  checklistFromTemplate,
  loadTemplate,
  applyTemplate,
} from "../../_shared/seed.js";

// Load the roster id list from KV, seeding it on first run.
async function roster(kv) {
  if (!kv) return [...CLIENT_ORDER];
  let ids = await kv.get(ROSTER_KEY, "json");
  if (!Array.isArray(ids)) {
    ids = [...CLIENT_ORDER];
    await kv.put(ROSTER_KEY, JSON.stringify(ids));
  }
  return ids;
}

// Merge a stored record over its seed default (if any), keyed by stable id.
function hydrate(id, stored) {
  const seed = defaultClient(id);
  let rec = stored ? (seed ? { ...seed, ...stored, id } : { ...stored, id }) : seed;
  if (!rec) return null;
  // untouched seed clients (no saved checklist) get the current template
  if (!Array.isArray(rec.checklist) || rec.checklist.length === 0) {
    rec.checklist = checklistTemplate();
  }
  return rec;
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "client";

export async function onRequestOptions() {
  return preflight();
}

export async function onRequestGet({ env }) {
  const kv = env.clinic_x_data;
  const ids = await roster(kv);
  const tpl = await loadTemplate(kv);
  const out = [];
  for (const id of ids) {
    const stored = kv ? await kv.get(id, "json") : null;
    const rec = hydrate(id, stored);
    if (!rec) continue;
    // one-time clear of the old seeded stage/blockers, plus the template merge
    // that keeps every client on the current order and wording
    const dirty = [migrateManualFields(rec), applyTemplate(rec, tpl)].some(Boolean);
    if (dirty && kv) await kv.put(id, JSON.stringify(rec));
    if (!rec.archived) out.push(rec);
  }
  return json(out);
}

export async function onRequestPost({ env, request }) {
  const kv = env.clinic_x_data;
  if (!kv) return json({ error: "KV binding 'clinic_x_data' not configured" }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }
  const name = (body.name || "").trim();
  if (!name) return json({ error: "name required" }, 400);

  // stable, unique id derived from the name
  const base = slugify(name);
  const id = `${base}-${Date.now().toString(36)}`;

  // new clients start on the current template, in its current order
  const checklist = checklistFromTemplate(await loadTemplate(kv));

  const rec = {
    id,
    name,
    stage: body.stage || INITIAL_STAGE,
    blockers: [],
    manualV: MANUAL_V,
    syncV: SYNC_V,
    checklist,
    notes: "",
    noteEntries: [],
    meetings: [],
    documents: [],
    folders: [],
    archived: false,
    updatedAt: new Date().toISOString(),
  };

  await kv.put(id, JSON.stringify(rec));

  const ids = await roster(kv);
  ids.push(id);
  await kv.put(ROSTER_KEY, JSON.stringify(ids));

  return json(rec);
}
