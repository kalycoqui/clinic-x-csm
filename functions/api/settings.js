// GET  /api/settings -> Kaly's dashboard settings
// POST /api/settings -> shallow-merge + save
//
// Three real settings:
//   defaultChecklist: [{id,text}] — the checklist template, in order. It is
//                                   the source of truth for EVERY client, not
//                                   just new ones (see _shared/seed.js).
//   stages: string[]              — the stage list offered by the stage selector
//   chatContext: boolean          — include active client's stage/blockers/notes
//                                   in the Claude chat request (default on)
import { json, preflight } from "../_shared/cors.js";
import { CHECKLIST_TEXTS, STAGES, normalizeTemplate } from "../_shared/seed.js";

const KEY = "user_kaly_settings";

function defaults() {
  return {
    defaultChecklist: normalizeTemplate(CHECKLIST_TEXTS),
    stages: STAGES,
    chatContext: true,
  };
}

export async function onRequestOptions() {
  return preflight();
}

export async function onRequestGet({ env }) {
  const kv = env.clinic_x_data;
  const stored = kv ? await kv.get(KEY, "json") : null;
  const merged = { ...defaults(), ...(stored || {}) };
  // upgrades a template still stored as plain strings
  merged.defaultChecklist = normalizeTemplate(merged.defaultChecklist);
  return json(merged);
}

export async function onRequestPost({ env, request }) {
  const kv = env.clinic_x_data;
  if (!kv) return json({ error: "KV binding 'clinic_x_data' not configured" }, 500);

  let patch;
  try {
    patch = await request.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }

  const current = (await kv.get(KEY, "json")) || defaults();
  const merged = { ...current, ...patch, updatedAt: new Date().toISOString() };
  // ids are assigned here, once, so a later reorder or rename keeps them
  merged.defaultChecklist = normalizeTemplate(merged.defaultChecklist);
  await kv.put(KEY, JSON.stringify(merged));
  return json(merged);
}
