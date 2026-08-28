# Clinic X — CSM Client Management Dashboard

Vite + React dashboard for Clinic X telehealth onboarding, backed by **Cloudflare
Pages + Workers KV**, with a **Claude** chat assistant. Lilac design, mobile-first
(390px → 1440px), zero `localStorage` — all state lives in KV.

## Features

- Left sidebar — 10 clients, tap to switch (stage + blocker count per client)
- Top tabs — Meetings · Documents · Notes · Checklist
- Checklist — toggle items (persisted per toggle) and add new ones
- Notes editor — persisted to KV on blur
- Claude chat panel (right, collapsible) — streams responses, keeps history in memory,
  and is given the active client's stage + blockers as context
- Lilac theme (`#D4B7E6`, `#E6D4F0`) with teal accents (`#0E7C66`)

## Architecture (one important change from the brief)

The brief asked the browser to call `api.anthropic.com` directly with
`VITE_ANTHROPIC_API_KEY`. **I did not do that** — a `VITE_`-prefixed key is baked
into the shipped JS bundle (anyone can read it), and the Anthropic API blocks
browser-origin calls by CORS anyway. Instead:

```
Browser ──► /api/*  (Cloudflare Pages Functions)  ──► KV  +  Anthropic API
                     key lives here as a secret, never in the client
```

- `functions/api/clients/index.js`     → `GET /api/clients`            (list all)
- `functions/api/clients/[clientId].js` → `GET/POST /api/clients/:id`  (fetch / merge+save)
- `functions/api/chat.js`               → `POST /api/chat`             (streams Claude, key server-side)

The frontend behaves exactly as specified — it just talks to same-origin `/api`
instead of Anthropic directly. If you truly want the direct-browser variant, it's
a small change; ask and I'll swap it.

Model: `claude-opus-4-8`, streamed. System prompt is the CSM prompt from the brief
plus the live client stage/blockers/notes.

## Prerequisites (the 3 items)

1. **Cloudflare account ID** — dash.cloudflare.com → right sidebar → Account ID
2. **KV namespace** `clinic_x_data` — created below
3. **Anthropic API key** — platform.anthropic.com

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars      # add your ANTHROPIC_API_KEY (server-side only)
npm run cf:dev                      # builds + serves app & API on http://localhost:8788
```

`cf:dev` uses wrangler's **local simulated KV** — no real namespace needed to develop.

(If you prefer the raw Vite HMR server: `npm run dev` on :5173, run
`wrangler pages dev dist` separately, and set `VITE_API_BASE` per `.env.local.example`.)

## Deploy to Cloudflare Pages

```bash
# 1. Log in
npx wrangler login

# 2. Create the KV namespace, then paste the printed id into wrangler.toml
npx wrangler kv namespace create clinic_x_data
#   -> update  id = "REPLACE_WITH_KV_NAMESPACE_ID"  in wrangler.toml

# 3. Deploy (builds first)
npm run deploy

# 4. Store the Anthropic key as a secret on the Pages project (once)
npx wrangler pages secret put ANTHROPIC_API_KEY
```

That's it — the same `wrangler.toml` KV binding applies to the deployed Functions,
and the secret is read as `env.ANTHROPIC_API_KEY` server-side.

## Client roster

Seeded from the Slack roster (`functions/_shared/seed.js`): Naked Envy, Avio MD,
Viking RX, Ametsa Health, Azul RX, Caroline, East Coast Longevity, Luun Health,
Opterka, Auravessa. The seed provides each client's starting stage/blockers and a
default checklist; once you edit anything, the KV record becomes authoritative.
