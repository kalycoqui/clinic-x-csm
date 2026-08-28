// GET  /api/clients/:clientId -> fetch one client (seed default or stored)
// POST /api/clients/:clientId -> shallow-merge body into stored record + save
//
// Handles rename ({name}), archive ({archived:true}), stage/blocker/checklist/
// notes/meetings/documents/folders updates — all merged by stable id so a
// rename never orphans data.
import { json, preflight } from "../../_shared/cors.js";
import { defaultClient, checklistTemplate } from "../../_shared/seed.js";

export async function onRequestOptions() {
  return preflight();
}

export async function onRequestGet({ env, params }) {
  const id = params.clientId;
  const kv = env.clinic_x_data;
  const stored = kv ? await kv.get(id, "json") : null;
  const seed = defaultClient(id);
  if (!stored && !seed) return json({ error: "unknown client" }, 404);

  const rec = stored ? (seed ? { ...seed, ...stored, id } : { ...stored, id }) : seed;
  if (!Array.isArray(rec.checklist) || rec.checklist.length === 0) {
    rec.checklist = checklistTemplate();
  }
  return json(rec);
}

export async function onRequestPost({ env, params, request }) {
  const id = params.clientId;
  const kv = env.clinic_x_data;
  if (!kv) return json({ error: "KV binding 'clinic_x_data' not configured" }, 500);

  let patch;
  try {
    patch = await request.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }

  const current = (await kv.get(id, "json")) || defaultClient(id);
  if (!current) return json({ error: "unknown client" }, 404);

  const merged = { ...current, ...patch, id, updatedAt: new Date().toISOString() };
  await kv.put(id, JSON.stringify(merged));
  return json(merged);
}
