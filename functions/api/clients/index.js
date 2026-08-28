// GET /api/clients  -> list all clients (KV values merged over seed defaults)
import { json, preflight } from "../../_shared/cors.js";
import { CLIENT_ORDER, defaultClient } from "../../_shared/seed.js";

export async function onRequestOptions() {
  return preflight();
}

export async function onRequestGet({ env }) {
  const kv = env.clinic_x_data;
  const clients = await Promise.all(
    CLIENT_ORDER.map(async (id) => {
      const stored = kv ? await kv.get(id, "json") : null;
      // KV value (if any) is authoritative; otherwise fall back to the seed.
      return stored ? { ...defaultClient(id), ...stored, id } : defaultClient(id);
    })
  );
  return json(clients);
}
