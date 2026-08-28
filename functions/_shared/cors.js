// Permissive CORS for personal use (no auth). Same-origin in production on
// Pages, but this keeps `vite dev` (5173) → `wrangler pages dev` (8788) working.
export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export function preflight() {
  return new Response(null, { status: 204, headers: CORS });
}
