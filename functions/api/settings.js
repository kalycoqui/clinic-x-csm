// GET  /api/settings -> Kaly's dashboard settings
// POST /api/settings -> shallow-merge + save
//
// Two real settings:
//   defaultChecklist: string[]  — template applied to NEW clients
//   chatContext: boolean        — include active client's stage/blockers/notes
//                                 in the Claude chat request (default on)
import { json, preflight } from "../_shared/cors.js";
import { CHECKLIST_TEXTS } from "../_shared/seed.js";

const KEY = "user_kaly_settings";

function defaults() {
  return { defaultChecklist: CHECKLIST_TEXTS, chatContext: true };
}

export async function onRequestOptions() {
  return preflight();
}

export async function onRequestGet({ env }) {
  const kv = env.clinic_x_data;
  const stored = kv ? await kv.get(KEY, "json") : null;
  return json({ ...defaults(), ...(stored || {}) });
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
  await kv.put(KEY, JSON.stringify(merged));
  return json(merged);
}
