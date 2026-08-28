// Seed roster for Clinic X CSM. Used as the default shape when a client
// record does not yet exist in KV. Pulled from the Slack roster; edit stages /
// blockers freely — first write to KV wins from then on.

export const CLIENT_ORDER = [
  "naked-envy",
  "avio-md",
  "viking-rx",
  "ametsa-health",
  "azul-rx",
  "caroline",
  "east-coast-longevity",
  "luun-health",
  "opterka",
  "auravessa",
];

const STAGES = [
  "Kickoff",
  "Discovery",
  "Build",
  "Integration",
  "Testing",
  "Go-Live",
  "Live",
];

function baseChecklist() {
  return [
    { id: "kickoff-call", text: "Kickoff call completed", done: false },
    { id: "sop-shared", text: "SOP shared with client", done: false },
    { id: "provider-roster", text: "Provider roster collected", done: false },
    { id: "ehr-integration", text: "EHR / telehealth integration configured", done: false },
    { id: "test-visit", text: "End-to-end test visit passed", done: false },
    { id: "go-live", text: "Go-live scheduled", done: false },
  ];
}

// Each seed defines starting stage + current blockers. Everything else
// (checklist state, notes) starts blank and lives in KV after first save.
const SEED = {
  "naked-envy": {
    name: "Naked Envy",
    stage: "Integration",
    blockers: ["Waiting on Stripe payout verification", "Provider licenses pending in 2 states"],
  },
  "avio-md": {
    name: "Avio MD",
    stage: "Build",
    blockers: ["EHR API credentials not yet provided"],
  },
  "viking-rx": {
    name: "Viking RX",
    stage: "Testing",
    blockers: ["Async intake form failing validation on mobile"],
  },
  "ametsa-health": {
    name: "Ametsa Health",
    stage: "Discovery",
    blockers: ["Awaiting signed BAA"],
  },
  "azul-rx": {
    name: "Azul RX",
    stage: "Go-Live",
    blockers: ["Final pharmacy routing sign-off"],
  },
  "caroline": {
    name: "Caroline",
    stage: "Kickoff",
    blockers: ["Need to schedule kickoff — no response since intro email"],
  },
  "east-coast-longevity": {
    name: "East Coast Longevity",
    stage: "Live",
    blockers: [],
  },
  "luun-health": {
    name: "Luun Health",
    stage: "Build",
    blockers: ["Branding assets outstanding", "Deciding sync vs async model"],
  },
  "opterka": {
    name: "Opterka",
    stage: "Discovery",
    blockers: ["Compliance review of consent flow in progress"],
  },
  "auravessa": {
    name: "Auravessa",
    stage: "Integration",
    blockers: ["Lab partner (Labcorp) API onboarding delayed"],
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
    checklist: baseChecklist(),
    notes: "",
    meetings: [],
    documents: [],
    updatedAt: null,
  };
}

export function allDefaultClients() {
  return CLIENT_ORDER.map((id) => defaultClient(id));
}

export { STAGES };
