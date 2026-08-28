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

// Canonical stage names (match the frontend STAGES ladder).
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

// Starting stage + current blockers per seed client. Everything else
// (checklist state, notes, meetings, docs) starts blank and lives in KV.
const SEED = {
  "avio-md": {
    name: "Avio MD",
    stage: "Build",
    blockers: ["EHR API credentials not yet provided"],
  },
  "omni-flourish": {
    name: "Omni Flourish",
    stage: "Planning",
    blockers: ["Waiting on signed onboarding forms"],
  },
  "ametsa-md": {
    name: "Ametsa MD",
    stage: "Design Phase",
    blockers: ["Logo direction not yet approved"],
  },
  "azul-rx": {
    name: "Azul Rx",
    stage: "Go-Live",
    blockers: ["Final pharmacy routing sign-off"],
  },
  caroline: {
    name: "Caroline",
    stage: "Early Stage",
    blockers: ["Need to schedule kickoff — no response since intro email"],
  },
  "luun-health": {
    name: "Luun Health",
    stage: "Build",
    blockers: ["Branding assets outstanding", "Deciding sync vs async model"],
  },
  "naked-health": {
    name: "Naked Health",
    stage: "Integration",
    blockers: ["LegitScript application in review"],
  },
  "solace-wellness": {
    name: "Solace Wellness",
    stage: "Testing",
    blockers: ["Async intake form failing validation on mobile"],
  },
  "viking-rx": {
    name: "Viking Rx",
    stage: "Testing",
    blockers: ["Payout dry run pending Stripe verification"],
  },
  "naked-envy": {
    name: "Naked Envy",
    stage: "Integration",
    blockers: ["Waiting on Stripe payout verification", "Provider licenses pending in 2 states"],
  },
};

export function defaultClient(id) {
  const s = SEED[id];
  if (!s) return null;
  return {
    id,
    name: s.name,
    stage: s.stage,
    blockers: s.blockers,
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
