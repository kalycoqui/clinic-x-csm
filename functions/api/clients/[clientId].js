// GET  /api/clients/:clientId -> fetch one client (KV over seed default)
// POST /api/clients/:clientId -> shallow-merge body into stored record and save
import { json, preflight } from "../../_shared/cors.js";
import { defaultClient } from "../../_shared/seed.js";

export async function onRequestOptions() {
  return preflight();
}

export async function onRequestGet({ env, params }) {
  const id = params.clientId;
  const seed = defaultClient(id);
  if (!seed) return json({ error: "unknown client" }, 404);

  const kv = env.clinic_x_data;
  const stored = kv ? await kv.get(id, "json") : null;
  return json(stored ? { ...seed, ...stored, id } : seed);
}

export async function onRequestPost({ env, params, request }) {
  const id = params.clientId;
  const seed = defaultClient(id);
  if (!seed) return json({ error: "unknown client" }, 404);

  const kv = env.clinic_x_data;
  if (!kv) return json({ error: "KV binding 'clinic_x_data' not configured" }, 500);

  let patch;
  try {
    patch = await request.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }

  const current = (await kv.get(id, "json")) || seed;
  // Shallow merge: checklist / notes / blockers / stage etc. are replaced
  // wholesale by whatever the client sends, which is what the UI intends.
  const merged = { ...current, ...patch, id, updatedAt: new Date().toISOString() };

  await kv.put(id, JSON.stringify(merged));
  return json(merged);
}
