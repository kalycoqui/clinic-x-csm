// POST /api/chat -> proxy to the Anthropic Messages API (streaming).
//
// The API key lives ONLY here, server-side, as the Cloudflare secret
// ANTHROPIC_API_KEY. It is never shipped to the browser. The frontend sends
// the message history + the active client's context; we build the system
// prompt and stream Claude's SSE response straight back to the page.
import { CORS, json, preflight } from "../_shared/cors.js";

const MODEL = "claude-opus-4-8";

const BASE_SYSTEM =
  "You are a CSM assistant for Clinic X telehealth onboarding. Deep knowledge " +
  "of SOP, Fathom learnings, client roster, blockers. Reference client stage " +
  "and current blockers. Keep responses concise and actionable.";

export async function onRequestOptions() {
  return preflight();
}

export async function onRequestPost({ env, request }) {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json(
      { error: "ANTHROPIC_API_KEY secret not set. Run: wrangler pages secret put ANTHROPIC_API_KEY" },
      500
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }

  const { messages = [], client } = body;

  // Fold the active client's live context into the system prompt so Claude can
  // reference stage + current blockers without the UI resending it each turn.
  let system = BASE_SYSTEM;
  if (client) {
    const blockers = (client.blockers || []).length
      ? client.blockers.map((b) => `- ${b}`).join("\n")
      : "- (none recorded)";
    system +=
      `\n\nACTIVE CLIENT: ${client.name}` +
      `\nStage: ${client.stage || "unknown"}` +
      `\nCurrent blockers:\n${blockers}`;
    if (client.notes && client.notes.trim()) {
      system += `\nCSM notes:\n${client.notes.trim()}`;
    }
  }

  const anthropicReq = {
    model: MODEL,
    max_tokens: 1024,
    stream: true,
    system,
    messages: messages
      .filter((m) => m && m.content && (m.role === "user" || m.role === "assistant"))
      .map((m) => ({ role: m.role, content: m.content })),
  };

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
  };
  // Identity-linked / admin keys must name the workspace they act in. Set the
  // ANTHROPIC_WORKSPACE_ID secret to use one; standard workspace-scoped keys
  // don't need it (the header is simply omitted).
  if (env.ANTHROPIC_WORKSPACE_ID) {
    headers["anthropic-workspace-id"] = env.ANTHROPIC_WORKSPACE_ID;
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers,
    body: JSON.stringify(anthropicReq),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return json({ error: "anthropic upstream error", status: upstream.status, detail }, 502);
  }

  // Pass the SSE stream straight through; the page parses content_block_delta.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      ...CORS,
    },
  });
}
