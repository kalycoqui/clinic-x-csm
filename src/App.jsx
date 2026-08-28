import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Sparkles,
  Send,
  Plus,
  Check,
  X,
  MessageSquare,
  CalendarDays,
  FileText,
  StickyNote,
  ListChecks,
  AlertCircle,
} from "lucide-react";
import "./App.css";

// Same-origin in production (Pages serves the app + /api). For `vite dev`
// against a separate `wrangler pages dev`, set VITE_API_BASE in .env.local.
const API = import.meta.env.VITE_API_BASE || "";

const TABS = [
  { id: "meetings", label: "Meetings", icon: CalendarDays },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "checklist", label: "Checklist", icon: ListChecks },
];

export default function App() {
  const [clients, setClients] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState("checklist");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Load the full roster from KV on mount.
  useEffect(() => {
    fetch(`${API}/api/clients`)
      .then((r) => {
        if (!r.ok) throw new Error(`clients ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setClients(data);
        setActiveId(data[0]?.id ?? null);
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, []);

  const active = clients.find((c) => c.id === activeId) || null;

  // Merge a patch into local state and persist it to KV.
  async function saveClient(id, patch) {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    try {
      await fetch(`${API}/api/clients/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch (e) {
      console.error("save failed", e);
    }
  }

  if (loading) return <div className="loading-screen">Loading Clinic X roster…</div>;
  if (error)
    return (
      <div className="error-screen">
        <AlertCircle size={28} />
        <p>Couldn’t reach the API.</p>
        <code style={{ fontSize: 12 }}>{error}</code>
      </div>
    );

  return (
    <div className="app">
      <header className="topbar">
        <button
          className="icon-btn hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open client list"
        >
          <Menu size={18} />
        </button>
        <div className="brand">
          <span className="dot">
            <Sparkles size={13} />
          </span>
          Clinic X CSM
        </div>
        <div className="spacer" />
        <button
          className={`icon-btn ${chatOpen ? "active" : ""}`}
          onClick={() => setChatOpen((v) => !v)}
          aria-label="Toggle Claude chat"
        >
          <MessageSquare size={18} />
        </button>
      </header>

      <div className="body">
        <div className="stage">
          <Sidebar
            clients={clients}
            activeId={activeId}
            open={sidebarOpen}
            onPick={(id) => {
              setActiveId(id);
              setSidebarOpen(false);
            }}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="main">
            {active && (
              <>
                <ClientHeader client={active} />
                <nav className="tabs">
                  {TABS.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        className={`tab ${tab === t.id ? "active" : ""}`}
                        onClick={() => setTab(t.id)}
                      >
                        <Icon size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />
                        {t.label}
                      </button>
                    );
                  })}
                </nav>
                <div className="tab-body">
                  <TabContent tab={tab} client={active} saveClient={saveClient} />
                </div>
              </>
            )}
          </main>
        </div>

        <ChatPanel open={chatOpen} client={active} onClose={() => setChatOpen(false)} />
      </div>

      {sidebarOpen && (
        <button className="overlay" onClick={() => setSidebarOpen(false)} aria-label="Close" />
      )}
    </div>
  );
}

function Sidebar({ clients, activeId, open, onPick, onClose }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <h2>Clients ({clients.length})</h2>
      {clients.map((c) => (
        <button
          key={c.id}
          className={`client-row ${c.id === activeId ? "active" : ""}`}
          onClick={() => onPick(c.id)}
        >
          <span className="name">{c.name}</span>
          <span className="meta">
            <span className="pill">{c.stage}</span>
            {(c.blockers?.length ?? 0) > 0 && (
              <>
                <span className="blocker-dot" />
                {c.blockers.length} blocker{c.blockers.length > 1 ? "s" : ""}
              </>
            )}
          </span>
        </button>
      ))}
      <button
        className="icon-btn"
        style={{ marginTop: 8, width: "100%" }}
        onClick={onClose}
      >
        <X size={16} />
      </button>
    </aside>
  );
}

function ClientHeader({ client }) {
  return (
    <div className="client-header">
      <h1>{client.name}</h1>
      <div className="sub">
        <span className="pill teal">Stage · {client.stage}</span>
        {client.updatedAt && (
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            Updated {new Date(client.updatedAt).toLocaleString()}
          </span>
        )}
      </div>
      {client.blockers?.length > 0 && (
        <div className="blockers">
          {client.blockers.map((b, i) => (
            <span className="blocker-tag" key={i}>
              ⚠ {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function TabContent({ tab, client, saveClient }) {
  if (tab === "checklist") return <Checklist client={client} saveClient={saveClient} />;
  if (tab === "notes") return <Notes client={client} saveClient={saveClient} />;
  if (tab === "meetings")
    return (
      <div className="empty">
        No meetings logged yet for {client.name}. Sync from Fathom or add manually.
      </div>
    );
  if (tab === "documents")
    return (
      <div className="empty">
        No documents attached for {client.name}. SOPs, BAAs, and contracts will show here.
      </div>
    );
  return null;
}

function Checklist({ client, saveClient }) {
  const [draft, setDraft] = useState("");
  const list = client.checklist || [];

  function toggle(itemId) {
    const next = list.map((it) => (it.id === itemId ? { ...it, done: !it.done } : it));
    saveClient(client.id, { checklist: next });
  }

  function add() {
    const text = draft.trim();
    if (!text) return;
    const item = { id: `c-${Date.now()}`, text, done: false };
    saveClient(client.id, { checklist: [...list, item] });
    setDraft("");
  }

  const doneCount = list.filter((i) => i.done).length;

  return (
    <div>
      <p style={{ margin: "0 0 12px", color: "var(--muted)", fontSize: 13 }}>
        {doneCount} / {list.length} complete
      </p>
      {list.map((it) => (
        <div key={it.id} className={`check-item ${it.done ? "completed" : ""}`}>
          <button
            className={`box ${it.done ? "done" : ""}`}
            onClick={() => toggle(it.id)}
            aria-label="toggle"
          >
            {it.done && <Check size={14} />}
          </button>
          <span className="txt">{it.text}</span>
        </div>
      ))}
      <div className="add-row">
        <input
          value={draft}
          placeholder="Add a checklist item…"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="btn" onClick={add}>
          <Plus size={16} style={{ verticalAlign: "-3px" }} /> Add
        </button>
      </div>
    </div>
  );
}

function Notes({ client, saveClient }) {
  const [text, setText] = useState(client.notes || "");

  // Keep local text in sync when switching clients.
  useEffect(() => {
    setText(client.notes || "");
  }, [client.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <textarea
        className="notes-area"
        value={text}
        placeholder={`Notes for ${client.name}… (saved on blur)`}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          if (text !== (client.notes || "")) saveClient(client.id, { notes: text });
        }}
      />
      <p className="notes-hint">Saved to Cloudflare KV when you click away.</p>
    </div>
  );
}

function ChatPanel({ open, client, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  async function send() {
    const content = input.trim();
    if (!content || busy) return;
    const history = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, client }),
      });

      if (!res.ok || !res.body) {
        const t = await res.text().catch(() => "");
        throw new Error(`chat ${res.status} ${t}`);
      }

      // Parse the Anthropic SSE stream and append text deltas live.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
              const chunk = evt.delta.text;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: copy[copy.length - 1].content + chunk,
                };
                return copy;
              });
            }
          } catch {
            /* ignore keep-alive / non-JSON lines */
          }
        }
      }
    } catch (e) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: `⚠ ${e.message}` };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className={`chat ${open ? "open" : ""}`}>
      <div className="chat-head">
        <Sparkles size={18} color="var(--teal)" />
        <div style={{ flex: 1 }}>
          <div className="title">Claude — CSM assistant</div>
          <div className="sub">{client ? `Context: ${client.name} · ${client.stage}` : "No client"}</div>
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Close chat">
          <X size={16} />
        </button>
      </div>

      <div className="chat-log" ref={logRef}>
        {messages.length === 0 && (
          <div className="chat-empty">
            Ask about {client?.name || "this client"}’s stage, blockers, or next steps.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.content || (busy && i === messages.length - 1 ? "…" : "")}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <textarea
          rows={1}
          value={input}
          placeholder="Message Claude…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button className="btn" onClick={send} disabled={busy || !input.trim()}>
          <Send size={16} />
        </button>
      </div>
    </aside>
  );
}
