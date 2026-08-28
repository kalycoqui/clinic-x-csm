// Seed roster + defaults for Clinic X CSM.
//
// Clients are keyed by a STABLE id (slug) so renames never orphan KV data.
// The live roster order + archive state lives in KV under ROSTER_KEY; this
// file only supplies the initial roster and the default shape for a record
// that does not exist in KV yet.

export const ROSTER_KEY = "__roster__";

// initial roster order (ids). New clients are appended in KV, not here.
export const CLIENT_ORDER = [
  "avio-md",
  "omni-flourish",
  "ametsa-md",
  "azul-rx",
  "caroline",
  "luun-health",
  "naked-health",
  "solace-wellness",
  "viking-rx",
  "naked-envy",
];

// Default stage names (match the frontend preset ladder). The live list is
// user-editable in Settings and lives in KV under the settings key.
export const STAGES = [
  "Early Stage",
  "Planning",
  "Design Phase",
  "Build",
  "Integration",
  "Testing",
  "Go-Live",
  "Post-Launch",
];

// The real Clinic X onboarding flow. New clients and untouched seed clients
// get this; an edited checklist in KV is never overwritten.
export const CHECKLIST_TEXTS = [
  "Onboarding forms received",
  "LLC filed",
  "LLC approved",
  "Logo drafts sent",
  "Logo finalized",
  "Domain secured / transferred",
  "Website draft built",
  "Website revisions complete",
  "Website live",
  "Shopify store set up",
  "Stripe application submitted",
  "Stripe approved",
  "Tagada application submitted (site 2)",
  "Tagada approved",
  "Pricing sheet reviewed",
  "GHL configured",
  "GHL training delivered",
  "EMR (Prescribery) access granted",
  "EMR training delivered",
  "Shopify training delivered",
  "LegitScript submitted",
  "LegitScript certified",
  "QA gate passed",
  "Go-live",
];

const slugItem = (text, i) =>
  `ck-${i}-` +
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24);

// Build checklist items from a list of texts (defaults to the standard flow).
export function checklistFromTexts(texts) {
  const list = Array.isArray(texts) && texts.length ? texts : CHECKLIST_TEXTS;
  return list.map((text, i) => ({ id: slugItem(text, i), text, done: false }));
}

export function checklistTemplate() {
  return checklistFromTexts(CHECKLIST_TEXTS);
}

// ---------------------------------------------------------------------------
// Checklist template
//
// The template is the single source of order + wording for every client. Its
// items carry a STABLE id derived from the text once and then stored, so a
// reorder or a rename never breaks the link to a client's checked state.
// ---------------------------------------------------------------------------

const tplSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32);

// Accept either the old string[] shape or the current [{id,text}] and return
// [{id,text}] with unique ids. Entries that already have an id keep it.
export function normalizeTemplate(list) {
  const src = Array.isArray(list) && list.length ? list : CHECKLIST_TEXTS;
  const seen = new Set();
  const out = [];
  for (const entry of src) {
    const text = String(typeof entry === "string" ? entry : entry?.text || "").trim();
    if (!text) continue;
    const base =
      (typeof entry === "object" && entry?.id) || `tpl-${tplSlug(text)}` || "tpl-item";
    let id = base;
    for (let n = 2; seen.has(id); n++) id = `${base}-${n}`;
    seen.add(id);
    out.push({ id, text });
  }
  return out;
}

// A brand-new client's checklist: the template, in template order.
export function checklistFromTemplate(template) {
  return normalizeTemplate(template).map((t) => ({ id: t.id, text: t.text, done: false }));
}

const textKey = (s) => String(s || "").trim().toLowerCase();

// Merge the template into one client's checklist.
//
//   - template items land in template order, with their current wording
//   - each item's done state is carried over, matched by id
//   - `firstSync` also matches by text, which is what hands records written
//     under the old index-derived ids over to the stable ones without losing
//     a single tick
//   - a template item that was deleted survives as `legacy` while it is still
//     checked (history worth keeping); unchecked, it just goes away
//   - client-only items (+ Add Item) are never touched and sit after the
//     template block
export function syncChecklist(current, template, firstSync = false) {
  const items = Array.isArray(current) ? current : [];
  const tpl = normalizeTemplate(template);
  const claimed = new Set();

  const byId = new Map();
  const byText = new Map();
  for (const it of items) {
    if (!byId.has(it.id)) byId.set(it.id, it);
    if (!byText.has(textKey(it.text))) byText.set(textKey(it.text), it);
  }

  const merged = tpl.map((t) => {
    let cur = byId.get(t.id);
    // a client's own item never gets absorbed into a template slot
    if (cur && (cur.custom || claimed.has(cur))) cur = null;
    if (!cur) {
      const byName = byText.get(textKey(t.text));
      if (byName && !byName.custom && !claimed.has(byName)) cur = byName;
    }
    if (cur) claimed.add(cur);
    return {
      id: t.id,
      text: t.text,
      done: !!(cur && cur.done),
      ...(cur && cur.owner ? { owner: cur.owner } : {}),
    };
  });

  const custom = [];
  const legacy = [];
  for (const it of items) {
    if (claimed.has(it)) continue;
    // on the very first sync nothing is treated as a template deletion: an
    // unmatched item can only be something the user added by hand
    if (it.custom || firstSync) custom.push({ ...it, custom: true, legacy: false });
    else if (it.done) legacy.push({ ...it, legacy: true });
  }

  return [...merged, ...custom, ...legacy];
}

// Bumped when the merge rules change in a way that needs a one-time pass.
export const SYNC_V = 1;

export const SETTINGS_KEY = "user_kaly_settings";

// The live template (order + wording) that every client follows.
export async function loadTemplate(kv) {
  const settings = kv ? await kv.get(SETTINGS_KEY, "json") : null;
  return normalizeTemplate(settings?.defaultChecklist);
}

// Bring one record in line with the template. Returns true when it changed and
// needs writing back to KV.
export function applyTemplate(rec, template) {
  const firstSync = rec.syncV !== SYNC_V;
  const before = JSON.stringify(rec.checklist || []);
  rec.checklist = syncChecklist(rec.checklist, template, firstSync);
  rec.syncV = SYNC_V;
  return firstSync || JSON.stringify(rec.checklist) !== before;
}

// The starting stage for every client. Stage is set by hand, so nothing here
// (or anywhere else) picks one for the user.
export const INITIAL_STAGE = "Early Stage";

// Seed roster names. Stage and blockers are user-controlled: they start empty
// and this file never supplies placeholder values for them. Everything else
// (checklist state, notes, meetings, docs) starts blank and lives in KV.
const SEED_NAMES = {
  "avio-md": "Avio MD",
  "omni-flourish": "Omni Flourish",
  "ametsa-md": "Ametsa MD",
  "azul-rx": "Azul Rx",
  caroline: "Caroline",
  "luun-health": "Luun Health",
  "naked-health": "Naked Health",
  "solace-wellness": "Solace Wellness",
  "viking-rx": "Viking Rx",
  "naked-envy": "Naked Envy",
};

// Records written before stage/blockers became manual still carry the old
// seeded values. `manualV` marks a record as cleared; one read migrates it.
export const MANUAL_V = 2;

// Clear seeded stage/blockers exactly once per record. Returns true when the
// record changed and needs writing back to KV.
export function migrateManualFields(rec) {
  if (!rec || rec.manualV === MANUAL_V) return false;
  rec.stage = INITIAL_STAGE;
  rec.blockers = [];
  rec.manualV = MANUAL_V;
  return true;
}

export function defaultClient(id) {
  const name = SEED_NAMES[id];
  if (!name) return null;
  return {
    id,
    name,
    stage: INITIAL_STAGE,
    blockers: [],
    checklist: checklistTemplate(),
    notes: "",
    noteEntries: [],
    meetings: [],
    documents: [],
    folders: [],
    archived: false,
    updatedAt: null,
  };
}
