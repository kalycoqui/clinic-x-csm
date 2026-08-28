// GET  /api/personal -> Kaly's personal dashboard (notes + reference docs)
// POST /api/personal -> shallow-merge body into the stored record and save
//
// Stored under a single KV key, separate from every client record.
import { json, preflight } from "../_shared/cors.js";

const KEY = "user_kaly_dashboard";

const DEFAULT = {
  notes: "",
  noteEntries: [],
  folders: [],
  docs: [
    {
      id: "sop-v4",
      kind: "SOP",
      short: "SOP v4",
      name: "Clinic X onboarding SOP v4",
      typeLabel: "Standard operating procedure",
      owner: "Kaly",
      source: "Notion",
      url: "https://www.notion.so",
      folderId: null,
      updated: null,
    },
    {
      id: "baa-template",
      kind: "BAA",
      short: "BAA template",
      name: "BAA template (countersigned)",
      typeLabel: "Business associate agreement",
      owner: "Legal",
      source: "Drive",
      url: "https://drive.google.com",
      folderId: null,
      updated: null,
    },
    {
      id: "stripe-troubleshooting",
      kind: "REF",
      short: "Stripe troubleshooting",
      name: "Stripe troubleshooting playbook",
      typeLabel: "Reference document",
      owner: "Kaly",
      source: "Notion",
      url: "https://www.notion.so",
      folderId: null,
      updated: null,
    },
    {
      id: "tagada-mapping",
      kind: "REF",
      short: "Tagada mapping",
      name: "Tagada field mapping (site 2)",
      typeLabel: "Reference document",
      owner: "Kaly",
      source: "Sheets",
      url: "https://sheets.google.com",
      folderId: null,
      updated: null,
    },
  ],
};

export async function onRequestOptions() {
  return preflight();
}

export async function onRequestGet({ env }) {
  const kv = env.clinic_x_data;
  const stored = kv ? await kv.get(KEY, "json") : null;
  return json(stored ? { ...DEFAULT, ...stored } : DEFAULT);
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

  const current = (await kv.get(KEY, "json")) || DEFAULT;
  const merged = { ...current, ...patch, updatedAt: new Date().toISOString() };

  await kv.put(KEY, JSON.stringify(merged));
  return json(merged);
}
