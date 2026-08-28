import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Menu,
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
  Printer,
  User,
  HelpCircle,
  Settings,
  Minimize2,
  Maximize2,
  Minus,
  ChevronRight,
  ExternalLink,
  Building2,
  Pencil,
  Trash2,
  Archive,
  CalendarPlus,
  Folder,
  FolderPlus,
  Upload,
  ZoomIn,
  ZoomOut,
  Save,
  Edit3,
  Image,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";

const STYLES = `
:root {
  /* primary */
  --lilac: #d4b7e6;
  --lilac-light: #e6d4f0;
  --teal: #0e7c66;
  --teal-dark: #0b6252;
  --gold: #ffd700;

  /* pastel pink grounds */
  --bg: #fff0f5;
  --bg-soft: #fff5fa;
  --card: #fffbfe;
  --header-1: #e3c9df;
  --header-2: #edd5e8;
  --header-3: #f3e0ec;

  /* pastel accents */
  --pink: #f8d7e8;
  --pink-ink: #8b3e5f;
  --peach: #f9e5d3;
  --peach-ink: #8a5528;
  --mint: #d9f2e8;
  --mint-ink: #256554;
  --violet: #f3e4f8;
  --violet-ink: #6b4c8a;
  --blue: rgba(197, 233, 245, 0.9);
  --blue-line: rgba(126, 192, 214, 0.55);
  --blue-ink: #2e4a54;

  /* text + lines */
  --ink: #3d2c5c;
  --body: #4a4a4a;
  --muted: #6b6076;
  --faint: #8a7280;
  --line: #f0dce6;
  --line-soft: #f7e7ef;
  --danger: #c2465a;

  --radius: 12px;
  --shadow-hover: 0 2px 8px rgba(122, 61, 95, 0.1);

  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 15px;
  line-height: 1.65;
  color: var(--body);
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  height: 100%;
}

body {
  background: var(--bg);
}

h1,
h2,
h3 {
  color: var(--ink);
  font-weight: 600;
  letter-spacing: -0.015em;
}

a {
  color: var(--teal);
  text-decoration: none;
}
a:hover {
  color: var(--teal-dark);
}

button {
  font: inherit;
  cursor: pointer;
}

input,
textarea {
  font: inherit;
  color: inherit;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background: var(--bg);
}

/* ---------- merged header + tab bar ---------- */
.topbar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 20px 0;
  background: linear-gradient(112deg, var(--header-1) 0%, var(--header-2) 46%, var(--header-3) 100%);
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.5), 0 1px 0 rgba(122, 61, 95, 0.08);
  overflow-x: auto;
}
.topbar::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 180% at 12% -40%, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 62%);
  pointer-events: none;
}
.topbar .spacer {
  flex: 1;
}

/* every tab in the header: home tab + document tabs */
.htab {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 2px;
  background: rgba(255, 255, 255, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-bottom: none;
  border-radius: 11px 11px 0 0;
  padding-right: 7px;
  transition: background 140ms ease;
}
.htab.active {
  background: var(--bg);
  border-color: var(--line);
}
.htab > .label {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 180px;
  font-size: 13.5px;
  font-weight: 500;
  color: #6b5b72;
  background: transparent;
  border: none;
  padding: 11px 4px 14px 13px;
  transition: color 140ms ease;
}
.htab.active > .label {
  color: var(--ink);
}
.htab.home {
  padding-right: 0;
}
.htab.home > .label {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  gap: 9px;
  padding: 10px 16px 13px;
}
.htab .name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.htab .min-dash {
  flex: 0 0 auto;
  width: 14px;
  height: 2px;
  border-radius: 2px;
  background: #c9a9e0;
}
.htab .tab-close {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: var(--faint);
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 3px;
  margin-bottom: 2px;
  line-height: 0;
  transition: background 140ms ease, color 140ms ease;
}
.htab .tab-close:hover {
  background: var(--pink);
  color: var(--pink-ink);
}
.star {
  flex: 0 0 auto;
  fill: var(--gold);
  stroke: rgba(150, 110, 0, 0.4);
  stroke-width: 0.7;
}
.kind-chip {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

/* header buttons sit on the header baseline, not the tab strip */
.head-btn {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 500;
  color: var(--peach-ink);
  background: var(--peach);
  border: 1px solid rgba(138, 85, 40, 0.22);
  border-radius: 10px;
  padding: 7px 13px;
  margin-bottom: 12px;
  white-space: nowrap;
  transition: box-shadow 140ms ease, background 140ms ease;
}
.head-btn:hover {
  box-shadow: 0 2px 8px rgba(122, 61, 95, 0.14);
}
.icon-btn {
  position: relative;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 12px;
  line-height: 0;
  transition: box-shadow 140ms ease, background 140ms ease;
}
.icon-btn:hover {
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 2px 8px rgba(122, 61, 95, 0.14);
}
.icon-btn.active {
  background: var(--teal);
  color: #fff;
  border-color: var(--teal);
}
.hamburger {
  display: none;
}

/* ---------- body ---------- */
.body {
  position: relative;
  flex: 1;
  display: flex;
  min-height: 0;
}

/* ---------- sidebar ---------- */
.sidebar {
  width: 288px;
  flex: 0 0 288px;
  border-right: 1px solid var(--line);
  background: var(--bg-soft);
  overflow-y: auto;
}
.kaly-block {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 16px;
  background: linear-gradient(180deg, #fce7f2 0%, #fadfec 78%, rgba(250, 223, 236, 0.94) 100%);
  border-bottom: 1px solid #f3d4e4;
}
.kaly-block .head {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 4px 10px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.kaly-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.kaly-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  text-align: left;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--violet-ink);
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 10px;
  padding: 9px 10px;
  transition: background 140ms ease, box-shadow 140ms ease, color 140ms ease;
}
.kaly-btn svg {
  flex: 0 0 auto;
  color: #b58ba8;
}
.kaly-btn:hover {
  box-shadow: var(--shadow-hover);
}
.kaly-btn.active {
  background: var(--card);
  border-color: var(--lilac);
  color: var(--ink);
}
.kaly-btn.active svg {
  color: var(--teal);
}

.client-list {
  padding: 16px;
}
.list-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--muted);
}
.list-head::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--line-soft);
}
.client-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius);
  padding: 11px 12px;
  margin-bottom: 2px;
  transition: background 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
}
.client-row:hover {
  background: #fdebf3;
  box-shadow: var(--shadow-hover);
}
.client-row.active {
  background: #fdebf3;
  border-color: #f3d4e4;
}
.client-row .name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.35;
  color: var(--ink);
}
.client-row .who {
  flex: 1;
  min-width: 0;
}
.stage-ring {
  flex: 0 0 auto;
  overflow: visible;
}
.pill {
  display: inline-block;
  margin-top: 3px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.5;
  padding: 1px 8px;
  border-radius: 999px;
}
.blocker-count {
  flex: 0 0 auto;
  font-size: 11px;
  font-weight: 500;
  color: var(--pink-ink);
  background: var(--pink);
  border-radius: 999px;
  padding: 1px 7px;
}

/* ---------- main ---------- */
.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.pane-head {
  padding: 24px 24px 0;
}
.pane-head h1 {
  margin: 0;
  font-size: 26px;
  letter-spacing: -0.02em;
  line-height: 1.25;
}
.pane-head .sub {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--muted);
}
.pane-head .title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.blockers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}
.blocker-tag {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: var(--pink-ink);
  background: var(--pink);
  border: 1px solid rgba(139, 62, 95, 0.18);
  padding: 5px 12px;
  border-radius: 999px;
}
.blocker-tag .tag-x {
  display: grid;
  place-items: center;
  margin: 0 -5px 0 -1px;
  padding: 2px;
  line-height: 0;
  color: var(--pink-ink);
  background: transparent;
  border: 0;
  border-radius: 999px;
  opacity: 0.5;
  transition: opacity 140ms ease, background 140ms ease;
}
.blocker-tag .tag-x:hover {
  opacity: 1;
  background: rgba(139, 62, 95, 0.14);
}
.add-blocker {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--muted);
  background: transparent;
  border: 1px dashed var(--line);
  padding: 5px 12px;
  border-radius: 999px;
  transition: color 140ms ease, background 140ms ease, border-color 140ms ease;
}
.add-blocker:hover {
  color: var(--pink-ink);
  background: var(--pink);
  border-style: solid;
  border-color: rgba(139, 62, 95, 0.18);
}
.blocker-input {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--pink-ink);
  background: var(--pink);
  border: 1px solid rgba(139, 62, 95, 0.18);
  padding: 5px 12px;
  border-radius: 999px;
}
.blocker-input input {
  width: 200px;
  max-width: 46vw;
  font-size: 12.5px;
  color: var(--pink-ink);
  background: transparent;
  border: 0;
  outline: none;
}
.blocker-input input::placeholder {
  color: rgba(139, 62, 95, 0.5);
}

/* ---------- stage picker ---------- */
.stage-select {
  position: relative;
  display: inline-block;
}
.stage-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 0;
  border: 0;
}
.stage-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 190px;
  max-height: 320px;
  overflow-y: auto;
  padding: 6px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: 0 14px 36px rgba(90, 44, 66, 0.2);
  animation: modalIn 140ms cubic-bezier(0.2, 0.8, 0.3, 1) both;
}
.stage-opt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 4px 6px;
  color: var(--muted);
  background: transparent;
  border: 0;
  border-radius: 8px;
  transition: background 140ms ease;
}
.stage-opt:hover {
  background: var(--bg-soft);
}
.stage-opt .pill {
  margin-top: 0;
}

.tabs {
  display: flex;
  gap: 2px;
  padding: 20px 24px 0;
  border-bottom: 1px solid var(--line);
  overflow-x: auto;
}
.tab {
  position: relative;
  flex: 0 0 auto;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
  background: transparent;
  border: none;
  padding: 10px 16px 13px;
  transition: color 140ms ease;
}
.tab .underline {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: -1px;
  height: 2px;
  border-radius: 2px;
  background: var(--teal);
  opacity: 0;
  transition: opacity 140ms ease;
}
.tab.active {
  color: var(--teal-dark);
}
.tab.active .underline {
  opacity: 1;
}

.tab-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px;
}
.fade-in {
  animation: panelIn 120ms ease-out both;
}

/* ---------- action row (add buttons) ---------- */
.action-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.action-row .hint {
  flex: 1;
  font-size: 13px;
  color: var(--muted);
}
.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 10px;
  padding: 7px 13px;
  white-space: nowrap;
  transition: box-shadow 140ms ease, filter 140ms ease;
}
.add-btn:hover {
  box-shadow: 0 2px 8px rgba(122, 61, 95, 0.14);
  filter: brightness(1.03);
}
.add-btn.pink {
  color: var(--pink-ink);
  background: var(--pink);
  border: 1px solid rgba(139, 62, 95, 0.22);
}
.add-btn.peach {
  color: var(--peach-ink);
  background: var(--peach);
  border: 1px solid rgba(138, 85, 40, 0.22);
}
.add-btn.mint {
  color: var(--mint-ink);
  background: var(--mint);
  border: 1px solid rgba(14, 124, 102, 0.2);
}
.add-btn.violet {
  color: var(--violet-ink);
  background: var(--violet);
  border: 1px solid rgba(107, 76, 138, 0.2);
}

.inline-form {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.inline-form input {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 12px 14px;
  background: var(--card);
  outline: none;
  transition: box-shadow 140ms ease, border-color 140ms ease;
}
.inline-form input:focus {
  border-color: var(--lilac);
  box-shadow: var(--shadow-hover);
}
.btn {
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: var(--radius);
  padding: 12px 20px;
  background: var(--teal);
  color: #fff;
  white-space: nowrap;
  transition: background 140ms ease, box-shadow 140ms ease;
}
.btn:hover {
  background: var(--teal-dark);
  box-shadow: 0 2px 8px rgba(14, 124, 102, 0.24);
}
.btn:disabled {
  opacity: 0.5;
  cursor: default;
}
.btn.ghost {
  background: transparent;
  color: var(--muted);
  border: 1px solid var(--line);
}
.btn.ghost:hover {
  background: var(--bg-soft);
  box-shadow: var(--shadow-hover);
}

/* ---------- cards ---------- */
.card {
  background: var(--card);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  transition: box-shadow 140ms ease, border-color 140ms ease;
}
.card:hover {
  box-shadow: var(--shadow-hover);
  border-color: #ebd2df;
}
.stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.empty {
  color: var(--muted);
  background: var(--card);
  border: 1px dashed #ebd2df;
  border-radius: var(--radius);
  padding: 40px;
  text-align: center;
}

/* ---------- checklist ---------- */
.progress-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}
.progress {
  flex: 1;
  height: 5px;
  border-radius: 999px;
  background: var(--line-soft);
  overflow: hidden;
}
.progress > span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--teal);
  transition: width 240ms ease;
}
.progress-row .count {
  font-size: 13px;
  color: var(--muted);
  white-space: nowrap;
}
.check-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  animation: rowIn 160ms ease-out both;
}
.check-item .box {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  border: 1.5px solid var(--lilac);
  background: transparent;
  display: grid;
  place-items: center;
  color: #fff;
  line-height: 0;
  transition: background 140ms ease, border-color 140ms ease;
}
.check-item .box.done {
  background: var(--teal);
  border-color: var(--teal);
}
.check-item .box svg {
  animation: checkPop 140ms ease-out both;
}
.check-item .txt {
  flex: 1;
  transition: color 140ms ease;
}
.check-item.completed .txt {
  color: #9a90a6;
  text-decoration: line-through;
}
.owner {
  font-size: 11px;
  font-weight: 500;
  border-radius: 999px;
  padding: 2px 9px;
}

/* ---------- notes accordion ---------- */
.acc {
  overflow: hidden;
}
.acc > .acc-head {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  padding: 16px;
}
.acc .chev {
  flex: 0 0 auto;
  transition: transform 140ms ease;
}
.acc.open .chev {
  transform: rotate(90deg);
}
.acc .acc-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
}
.acc .acc-meta {
  font-size: 12px;
  color: var(--muted);
}
.acc-body {
  padding: 0 16px 16px 40px;
  overflow: hidden;
  animation: accIn 160ms ease-out both;
}
.acc-body p {
  margin: 0;
  text-wrap: pretty;
}
.notes-area {
  width: 100%;
  min-height: 220px;
  font-size: 14.5px;
  line-height: 1.65;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 14px;
  background: var(--bg-soft);
  resize: vertical;
  outline: none;
  transition: box-shadow 140ms ease, border-color 140ms ease;
}
.notes-area:focus {
  border-color: var(--lilac);
  box-shadow: var(--shadow-hover);
}

/* ---------- document rows + document pane ---------- */
.doc-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  animation: rowIn 160ms ease-out both;
}
.doc-tile {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  line-height: 0;
}
.doc-row .who {
  flex: 1;
  min-width: 0;
}
.doc-row .name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.4;
}
.doc-row .meta {
  display: block;
  font-size: 12px;
  color: var(--muted);
}
.link-btn {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--teal-dark);
  background: transparent;
  border: 1px solid rgba(14, 124, 102, 0.28);
  border-radius: 9px;
  padding: 5px 11px;
  transition: background 140ms ease;
}
.link-btn:hover {
  background: var(--mint);
}

.doc-pane-head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid var(--line);
}
.doc-pane-head .doc-tile {
  width: 44px;
  height: 44px;
  border-radius: 12px;
}
.doc-pane-head h1 {
  margin: 0;
  font-size: 22px;
  line-height: 1.3;
}
.doc-facts {
  max-width: 660px;
  display: grid;
  grid-template-columns: 118px 1fr;
  gap: 12px 20px;
  padding: 20px;
  font-size: 14px;
}
.doc-facts dt {
  color: var(--muted);
  margin: 0;
}
.doc-facts dd {
  margin: 0;
}
.doc-open {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-top: 1px solid var(--line-soft);
  background: var(--bg-soft);
}
.doc-open .ext {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: var(--teal);
  border-radius: 10px;
  padding: 10px 16px;
}
.doc-open .ext:hover {
  background: var(--teal-dark);
  color: #fff;
}
.doc-open .note {
  flex: 1;
  font-size: 12.5px;
  color: var(--muted);
  text-wrap: pretty;
}

/* ---------- minimize dock ---------- */
.dock {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 35;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}
.dock-card {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 272px;
  padding: 10px 12px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: 0 8px 24px rgba(122, 61, 95, 0.18);
  animation: dockIn 180ms cubic-bezier(0.2, 0.8, 0.3, 1) both;
}
.dock-card .doc-tile {
  width: 26px;
  height: 26px;
  border-radius: 8px;
}
.dock-card .who {
  flex: 1;
  min-width: 0;
}
.dock-card .name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dock-card .src {
  display: block;
  font-size: 11px;
  color: var(--muted);
}
.mini-btn {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: var(--muted);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 5px;
  line-height: 0;
  transition: background 140ms ease, color 140ms ease;
}
.mini-btn:hover {
  background: var(--bg-soft);
}
.mini-btn.close:hover {
  background: var(--pink);
  color: var(--pink-ink);
}

/* ---------- stage guide modal ---------- */
.veil {
  position: absolute;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 40px;
  background: rgba(90, 44, 66, 0.28);
  animation: veilIn 140ms ease-out both;
}
.modal {
  width: 660px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 70px rgba(90, 44, 66, 0.32);
  animation: modalIn 180ms cubic-bezier(0.2, 0.8, 0.3, 1) both;
}
.modal-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fdeef5, var(--card));
  border-bottom: 1px solid var(--line-soft);
}
.modal-head h2 {
  margin: 0;
  font-size: 17px;
}
.modal-head .sub {
  font-size: 13px;
  color: var(--muted);
}
.modal-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 24px 24px;
}
.stage-row {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid #faeff4;
}
.stage-row .badge {
  flex: 0 0 132px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  padding: 4px 10px;
  border-radius: 999px;
}
.stage-row .desc {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  text-wrap: pretty;
}
.stage-row .count {
  flex: 0 0 auto;
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
}

/* ---------- chat ---------- */
.chat {
  width: 400px;
  flex: 0 0 400px;
  border-left: 1px solid var(--line);
  background: var(--card);
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.chat-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #fdeef5, var(--card));
  border-bottom: 1px solid var(--line-soft);
}
.chat-head svg {
  flex: 0 0 auto;
  color: var(--teal);
}
.chat-head .who {
  flex: 1;
  min-width: 0;
}
.chat-head .title {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
}
.chat-head .sub {
  display: block;
  font-size: 12px;
  color: var(--muted);
}
.chat-log {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.msg {
  max-width: 86%;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  animation: bubbleIn 180ms ease-out both;
}
.msg.user {
  align-self: flex-end;
  background: var(--blue);
  border: 1px solid var(--blue-line);
  color: var(--blue-ink);
  border-bottom-right-radius: 4px;
}
.msg.assistant {
  align-self: flex-start;
  background: #fdeef5;
  border: 1px solid var(--line-soft);
  color: var(--body);
  border-bottom-left-radius: 4px;
}
.chat-empty {
  color: var(--muted);
  font-size: 14px;
  text-align: center;
  margin: auto 0;
  padding: 0 16px;
}
.chat-input {
  display: flex;
  gap: 10px;
  padding: 16px;
  border-top: 1px solid var(--line-soft);
}
.chat-input textarea {
  flex: 1;
  font-size: 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 11px 13px;
  resize: none;
  max-height: 120px;
  background: var(--bg-soft);
  outline: none;
  transition: box-shadow 140ms ease, border-color 140ms ease;
}
.chat-input textarea:focus {
  border-color: var(--lilac);
  box-shadow: var(--shadow-hover);
}
.chat-input .btn {
  display: grid;
  place-items: center;
  padding: 0 16px;
  line-height: 0;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(90, 44, 66, 0.3);
  border: none;
  z-index: 20;
  display: none;
}

.loading-screen,
.error-screen {
  display: grid;
  place-items: center;
  height: 100vh;
  height: 100dvh;
  color: var(--muted);
  padding: 24px;
  text-align: center;
}

/* ---------- animations ---------- */
@keyframes panelIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: none; }
}
@keyframes rowIn {
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: none; }
}
@keyframes checkPop {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: none; }
}
@keyframes bubbleIn {
  from { opacity: 0; transform: translateX(18px); }
  to { opacity: 1; transform: none; }
}
@keyframes accIn {
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 600px; }
}
@keyframes veilIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes modalIn {
  from { opacity: 0; transform: translateY(10px) scale(0.985); }
  to { opacity: 1; transform: none; }
}
@keyframes dockIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* ---------- mobile: 390 and below ---------- */
@media (max-width: 900px) {
  .hamburger {
    display: grid;
  }
  .htab.home > .label {
    font-size: 15px;
    padding: 10px 12px 13px;
  }
  .head-btn span.txt {
    display: none;
  }
  .body {
    display: block;
    overflow-y: auto;
  }
  .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: min(320px, 86%);
    flex: none;
    transform: translateX(-100%);
    transition: transform 200ms ease;
    z-index: 30;
    box-shadow: 12px 0 32px rgba(122, 61, 95, 0.16);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .overlay {
    display: block;
  }
  .main {
    min-height: auto;
  }
  .tab-body {
    overflow: visible;
    padding: 16px;
  }
  .pane-head {
    padding: 16px 16px 0;
  }
  .pane-head h1 {
    font-size: 21px;
  }
  .tabs {
    padding: 16px 16px 0;
  }

  /* chat stacks below the checklist instead of a right rail */
  .chat {
    width: auto;
    flex: none;
    border-left: none;
    border-top: 1px solid var(--line);
    margin: 0;
  }
  .chat-log {
    max-height: 320px;
    padding: 16px;
  }
  .check-item .box {
    width: 26px;
    height: 26px;
  }
  .add-btn,
  .link-btn,
  .mini-btn {
    min-height: 44px;
  }
  .dock {
    right: 12px;
    bottom: 12px;
    left: 12px;
  }
  .dock-card {
    width: auto;
  }
  .veil {
    padding: 16px;
  }
  .modal {
    width: 100%;
  }
  .stage-row {
    flex-wrap: wrap;
  }
  .stage-row .badge {
    flex: 0 0 auto;
  }
  .doc-facts {
    grid-template-columns: 1fr;
    gap: 2px 0;
  }
  .doc-facts dt {
    margin-top: 10px;
  }
}

/* ---------- print: clean checklist export ---------- */
@media print {
  @page {
    margin: 18mm 16mm;
  }
  body {
    background: #fff;
  }
  .app {
    height: auto;
    display: block;
  }
  .topbar,
  .sidebar,
  .chat,
  .dock,
  .veil,
  .overlay,
  .tabs,
  .action-row,
  .inline-form,
  .add-btn,
  .add-blocker,
  .blocker-tag .tag-x,
  .stage-menu,
  .link-btn,
  .icon-btn,
  .head-btn,
  .notes-hint {
    display: none !important;
  }
  .body,
  .main,
  .tab-body {
    display: block;
    overflow: visible;
    padding: 0;
    min-height: 0;
  }
  .print-head {
    display: block !important;
    margin: 0 0 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }
  .print-head h1 {
    margin: 0;
    font-size: 20pt;
  }
  .print-head .sub {
    font-size: 10pt;
    color: #555;
  }
  .print-block {
    display: block !important;
    break-inside: avoid;
  }
  .card,
  .check-item,
  .acc {
    background: #fff !important;
    border-color: #ddd !important;
    box-shadow: none !important;
  }
  .acc-body {
    display: block !important;
    max-height: none !important;
    opacity: 1 !important;
    animation: none !important;
  }
  .check-item {
    padding: 6pt 8pt;
    animation: none;
  }
  .notes-area {
    border: 1px solid #ddd;
    background: #fff;
    min-height: 0;
    height: auto;
  }
  .print-only {
    display: block !important;
  }
}
.print-head,
.print-only {
  display: none;
}

/* ---------- client row actions + add client ---------- */
.client-row {
  cursor: pointer;
}
.client-row .pick {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
}
.client-row .actions {
  display: flex;
  gap: 2px;
  flex: 0 0 auto;
  opacity: 0;
  transition: opacity 140ms ease;
}
.client-row:hover .actions,
.client-row.active .actions {
  opacity: 1;
}
.row-action {
  display: grid;
  place-items: center;
  color: var(--faint);
  background: transparent;
  border: none;
  border-radius: 7px;
  padding: 5px;
  line-height: 0;
  transition: background 140ms ease, color 140ms ease;
}
.row-action:hover {
  background: rgba(255, 255, 255, 0.7);
  color: var(--ink);
}
.row-action.danger:hover {
  background: var(--pink);
  color: var(--pink-ink);
}
.rename-input {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  border: 1px solid var(--lilac);
  border-radius: 8px;
  padding: 4px 8px;
  background: #fff;
  outline: none;
}
.add-client {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--violet-ink);
  background: var(--violet);
  border: 1px dashed rgba(107, 76, 138, 0.4);
  border-radius: var(--radius);
  padding: 11px 12px;
  justify-content: center;
  transition: box-shadow 140ms ease;
}
.add-client:hover {
  box-shadow: var(--shadow-hover);
}
.add-client-form {
  margin-top: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.add-client-form input,
.add-client-form select,
.field select,
.field input,
.field textarea {
  width: 100%;
  font-size: 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 9px 11px;
  background: var(--bg-soft);
  outline: none;
}
.add-client-form input:focus,
.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: var(--lilac);
  box-shadow: var(--shadow-hover);
}
.add-client-form .row {
  display: flex;
  gap: 8px;
}

/* ---------- meetings ---------- */
.meeting-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  margin-bottom: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.field label {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
}
.field-row {
  display: flex;
  gap: 12px;
}
.field-row .field {
  flex: 1;
}
.meeting-card {
  padding: 0;
  overflow: hidden;
}
.meeting-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
}
.meeting-head .who {
  flex: 1;
  min-width: 0;
  cursor: pointer;
  background: transparent;
  border: none;
  text-align: left;
  display: block;
}
.meeting-head .name {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink);
}
.meeting-head .when {
  display: block;
  font-size: 12.5px;
  color: var(--muted);
}
.meeting-actions {
  display: flex;
  gap: 4px;
  flex: 0 0 auto;
  flex-wrap: wrap;
}
.gcal-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--mint-ink);
  background: var(--mint);
  border: 1px solid rgba(14, 124, 102, 0.22);
  border-radius: 9px;
  padding: 6px 10px;
  white-space: nowrap;
}
.gcal-btn:hover {
  box-shadow: var(--shadow-hover);
}
.meeting-body {
  padding: 0 16px 16px;
  border-top: 1px solid var(--line-soft);
}
.meeting-body .notes-area {
  margin-top: 12px;
}

/* ---------- notes entry header (title edit + delete) ---------- */
.entry-actions {
  display: flex;
  gap: 2px;
  flex: 0 0 auto;
}

/* ---------- documents: folders + upload + tiles ---------- */
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 22px;
  margin-bottom: 16px;
  color: var(--muted);
  font-size: 13px;
  text-align: center;
  background: var(--bg-soft);
  border: 1.5px dashed #e3bfd4;
  border-radius: var(--radius);
  transition: background 140ms ease, border-color 140ms ease;
}
.dropzone.drag {
  background: var(--violet);
  border-color: var(--lilac);
  color: var(--violet-ink);
}
.dropzone .pick-link {
  color: var(--teal-dark);
  font-weight: 600;
  text-decoration: underline;
}
.folder-group {
  margin-bottom: 18px;
}
.folder-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 4px 10px;
  color: var(--muted);
}
.folder-head .folder-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
.folder-head .spacer {
  flex: 1;
}
.doc-actions {
  display: flex;
  gap: 4px;
  flex: 0 0 auto;
}
.doc-folder-select {
  font-size: 11.5px;
  color: var(--muted);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 3px 6px;
  background: var(--bg-soft);
}

/* ---------- document preview ---------- */
.preview-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-top: 1px solid var(--line-soft);
  border-bottom: 1px solid var(--line-soft);
  background: var(--bg-soft);
}
.preview-toolbar .zoom-label {
  font-size: 12px;
  color: var(--muted);
  min-width: 52px;
}
.preview-wrap {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 20px;
  display: grid;
  place-items: start center;
  background: #fbf3f8;
}
.preview-img {
  transform-origin: top center;
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(122, 61, 95, 0.16);
}
.preview-pdf {
  width: 100%;
  height: 72vh;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
}

/* ---------- settings ---------- */
.setting-card {
  padding: 18px;
}
.setting-card h3 {
  margin: 0 0 4px;
  font-size: 15px;
}
.setting-card .desc {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 14px;
}
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--ink);
  background: transparent;
  border: none;
}
.toggle .track {
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: #e6cfe0;
  position: relative;
  transition: background 160ms ease;
}
.toggle .track::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 160ms ease;
}
.toggle.on .track {
  background: var(--teal);
}
.toggle.on .track::after {
  transform: translateX(18px);
}
.template-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.template-row .num {
  font-size: 12px;
  color: var(--faint);
  width: 20px;
  flex: 0 0 auto;
  text-align: right;
}
.template-row input {
  flex: 1;
  font-size: 13.5px;
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 8px 10px;
  background: var(--bg-soft);
  outline: none;
}
.template-row input:focus {
  border-color: var(--lilac);
}
.template-row.dragging {
  opacity: 0.45;
}
.template-row.drop-target {
  box-shadow: inset 0 2px 0 var(--lilac);
}
.drag-handle {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  padding: 4px 2px;
  line-height: 0;
  color: var(--faint);
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: grab;
  transition: color 140ms ease, background 140ms ease;
}
.drag-handle:hover {
  color: var(--ink);
  background: var(--bg-soft);
}
.drag-handle:active {
  cursor: grabbing;
}
.row-action:disabled {
  opacity: 0.3;
  cursor: default;
}
.row-action:disabled:hover {
  background: transparent;
  color: var(--muted);
}
.apply-note {
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--faint);
  text-wrap: pretty;
}
.check-item.legacy {
  border-style: dashed;
  opacity: 0.72;
}
.legacy-chip {
  background: var(--line-soft);
  color: var(--faint);
}

`;

// The design ships with the component: styles are injected at mount, so no
// App.css / index.css import is required and nothing can be lost in a merge.
function useDesignStyles() {
  useEffect(() => {
    if (!document.getElementById("clinicx-fonts")) {
      const link = document.createElement("link");
      link.id = "clinicx-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
      document.head.appendChild(link);
    }
    if (!document.getElementById("clinicx-styles")) {
      const tag = document.createElement("style");
      tag.id = "clinicx-styles";
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);
}

// Same-origin in production (Pages serves the app + /api). For `vite dev`
// against a separate `wrangler pages dev`, set VITE_API_BASE in .env.local.
const API = import.meta.env.VITE_API_BASE || "";

const CLIENT_TABS = [
  { id: "meetings", label: "Meetings", icon: CalendarDays },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "checklist", label: "Checklist", icon: ListChecks },
];

// Kaly's own space — separate from every client record.
const KALY_NAV = [
  { id: "personal-notes", label: "Personal Notes", icon: StickyNote },
  { id: "personal-docs", label: "Reference Docs", icon: FileText },
  { id: "stage-guide", label: "Stage Guide", icon: HelpCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

// Preset stage ladder. Badge colors run pink -> peach -> mint -> teal so the
// color itself reads as progress; the sidebar ring uses the same hue. The live
// list is whatever the user keeps in Settings — these supply the palette and
// the descriptions for any name that survives from the presets.
const STAGES = [
  {
    name: "Early Stage",
    desc: "Signed, not started. Intro email sent, kickoff not yet on the calendar.",
    bg: "#F8D7E8",
    color: "#96496C",
    ring: "#DE9BBC",
  },
  {
    name: "Planning",
    desc: "Gathering requirements — providers, states, service lines, intake model.",
    bg: "#F9DCE0",
    color: "#8E4459",
    ring: "#DFA0AC",
  },
  {
    name: "Design Phase",
    desc: "Website and branding in progress. Copy and consent language under review.",
    bg: "#F9E5D3",
    color: "#8A5528",
    ring: "#DDAE85",
  },
  {
    name: "Build",
    desc: "Development. Portal, intake flows, and provider accounts being assembled.",
    bg: "#F5EDD5",
    color: "#6F5522",
    ring: "#CFB878",
  },
  {
    name: "Integration",
    desc: "Stripe, Tagada, and GHL wiring. Credentials exchanged and webhooks verified.",
    bg: "#E8EFD9",
    color: "#4E6730",
    ring: "#A6BE86",
  },
  {
    name: "Testing",
    desc: "QA and soft-launch prep. End-to-end test visits, mobile validation, payout dry run.",
    bg: "#D9F2E8",
    color: "#256554",
    ring: "#7CC7AE",
  },
  {
    name: "Go-Live",
    desc: "Live on production. Monitoring first real visits and payment settlement daily.",
    bg: "#C6EBDD",
    color: "#1B6E58",
    ring: "#4FB295",
  },
  {
    name: "Post-Launch",
    desc: "Ongoing optimization — conversion, retention, and new service lines.",
    bg: "#ADE0C9",
    color: "#0B6252",
    ring: "#0E7C66",
  },
];

const DEFAULT_STAGE_NAMES = STAGES.map((s) => s.name);

// Older KV records still carry the seed's stage words; map them on read so the
// sidebar pill and the stage guide always agree.
const STAGE_ALIASES = {
  Kickoff: "Early Stage",
  Discovery: "Planning",
  Live: "Post-Launch",
};

// Turn the user's editable name list into full defs: a preset name keeps its
// color and description, a custom one borrows the palette at its position.
function buildStageDefs(names) {
  const list = Array.isArray(names) && names.length ? names : DEFAULT_STAGE_NAMES;
  return list.map((name, i) => {
    const preset = STAGES.find((s) => s.name === name);
    return preset || { ...STAGES[i % STAGES.length], name, desc: "" };
  });
}

// The live stage list, so every badge in the tree reads the same one.
const StagesCtx = createContext(STAGES);
const useStageDefs = () => useContext(StagesCtx);

const OWNER_TINT = {
  Kaly: { bg: "#F3E4F8", color: "#6B4C8A" },
  Client: { bg: "#F9E5D3", color: "#8A5528" },
  Eng: { bg: "#D9F2E8", color: "#256554" },
};

const DOC_TINTS = [
  { bg: "#F3E4F8", color: "#6B4C8A" },
  { bg: "#F8D7E8", color: "#96496C" },
  { bg: "#F9E5D3", color: "#8A5528" },
  { bg: "#D9F2E8", color: "#256554" },
  { bg: "#E8EFD9", color: "#4E6730" },
];

const stageDef = (name, defs = STAGES) => {
  const canonical = STAGE_ALIASES[name] || name;
  return defs.find((s) => s.name === canonical) || defs[0];
};

const docTint = (doc) => {
  const seed = String(doc.id || doc.name || "").length;
  return DOC_TINTS[seed % DOC_TINTS.length];
};

const shortName = (name) => (name.length > 26 ? `${name.slice(0, 25)}…` : name);

const GoldStar = ({ size = 20 }) => (
  <svg className="star" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.4l2.72 6.5 7.03.57-5.35 4.6 1.62 6.86L12 17.28 5.98 20.93 7.6 14.07 2.25 9.47l7.03-.57z" />
  </svg>
);

// Building tile tinted to the client's current stage.
const ClientTile = ({ stage }) => {
  const def = stageDef(stage, useStageDefs());
  return (
    <span className="doc-tile" style={{ background: def.bg, color: def.color }}>
      <Building2 size={16} />
    </span>
  );
};

const newId = (p) => `${p}-${Date.now().toString(36)}-${Math.round(performance.now())}`;

// Read a File into a base64 data URL (for KV-stored images / PDFs).
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// Build a Google Calendar "add event" URL from a meeting (date + time, +1h).
function gcalUrl(m) {
  const text = encodeURIComponent(m.title || "Meeting");
  const details = encodeURIComponent(m.notes || "");
  if (!m.date) {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}`;
  }
  const start = new Date(`${m.date}T${m.time || "09:00"}`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d) =>
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0") +
    "T" +
    String(d.getHours()).padStart(2, "0") +
    String(d.getMinutes()).padStart(2, "0") +
    "00";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&dates=${fmt(
    start
  )}/${fmt(end)}`;
}

const MEETING_TEMPLATE = `Attendees:

Small talk / personal detail:

Agenda covered:

Decisions made:

Promises (each with due date/time):

Client homework before next call:

Next meeting scheduled for:`;

export default function App() {
  useDesignStyles();

  const [clients, setClients] = useState([]);
  const [personal, setPersonal] = useState({ notes: "", noteEntries: [], docs: [], folders: [] });
  const [settings, setSettings] = useState({
    defaultChecklist: [],
    stages: DEFAULT_STAGE_NAMES,
    chatContext: true,
  });
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState("checklist");
  const [view, setView] = useState("client"); // client | personal-notes | personal-docs | settings
  const [docTabs, setDocTabs] = useState([]); // [{ doc, minimized }] — session only
  const [activeDoc, setActiveDoc] = useState(null); // doc id or null (home)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/clients`).then((r) => {
        if (!r.ok) throw new Error(`clients ${r.status}`);
        return r.json();
      }),
      fetch(`${API}/api/personal`)
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => ({})),
      fetch(`${API}/api/settings`)
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => ({})),
    ])
      .then(([roster, mine, sett]) => {
        setClients(roster);
        setActiveId(roster[0]?.id ?? null);
        setPersonal({
          notes: mine.notes || "",
          noteEntries: mine.noteEntries || [],
          docs: mine.docs || [],
          folders: mine.folders || [],
        });
        setSettings({
          defaultChecklist: sett.defaultChecklist || [],
          stages: sett.stages?.length ? sett.stages : DEFAULT_STAGE_NAMES,
          chatContext: sett.chatContext !== false,
        });
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, []);

  const active = clients.find((c) => c.id === activeId) || null;
  const stageDefs = useMemo(() => buildStageDefs(settings.stages), [settings.stages]);

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

  async function savePersonal(patch) {
    setPersonal((prev) => ({ ...prev, ...patch }));
    try {
      await fetch(`${API}/api/personal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch (e) {
      console.error("personal save failed", e);
    }
  }

  async function saveSettings(patch) {
    setSettings((prev) => ({ ...prev, ...patch }));
    try {
      const res = await fetch(`${API}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const saved = await res.json();
      if (saved?.defaultChecklist) setSettings((prev) => ({ ...prev, ...saved }));
      // the template drives every client's checklist, so pull the roster back
      // in to show the merge that just happened server-side
      if (patch.defaultChecklist) {
        const roster = await fetch(`${API}/api/clients`).then((r) => r.json());
        if (Array.isArray(roster)) setClients(roster);
      }
    } catch (e) {
      console.error("settings save failed", e);
    }
  }

  // --- client roster management -------------------------------------------
  async function addClient(name, stage) {
    try {
      const res = await fetch(`${API}/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, stage }),
      });
      if (!res.ok) throw new Error(`add client ${res.status}`);
      const rec = await res.json();
      setClients((prev) => [...prev, rec]);
      setActiveId(rec.id);
      setView("client");
    } catch (e) {
      console.error("add client failed", e);
    }
  }

  // rename keeps the same stable id — KV data (checklist/notes/meetings) survives
  function renameClient(id, name) {
    saveClient(id, { name });
  }

  // archive hides from the list but retains all data in KV
  function archiveClient(id) {
    setClients((prev) => {
      const next = prev.filter((c) => c.id !== id);
      setActiveId((cur) => (cur === id ? next[0]?.id ?? null : cur));
      return next;
    });
    saveClient(id, { archived: true });
  }

  // --- document tabs -------------------------------------------------------
  // Opening a doc pins a tab and maximizes it; any other open doc auto-minimizes.
  function openDoc(doc) {
    setDocTabs((prev) => {
      const known = prev.some((t) => t.doc.id === doc.id);
      return known
        ? prev.map((t) => ({ ...t, minimized: t.doc.id !== doc.id }))
        : [...prev.map((t) => ({ ...t, minimized: true })), { doc, minimized: false }];
    });
    setActiveDoc(doc.id);
  }

  function minimizeDoc(id) {
    setDocTabs((prev) => prev.map((t) => (t.doc.id === id ? { ...t, minimized: true } : t)));
    setActiveDoc((cur) => (cur === id ? null : cur));
  }

  function closeDoc(id) {
    setDocTabs((prev) => prev.filter((t) => t.doc.id !== id));
    setActiveDoc((cur) => (cur === id ? null : cur));
  }

  function goHome() {
    setActiveDoc(null);
  }

  function pickKaly(id) {
    if (id === "stage-guide") {
      setGuideOpen(true);
      setActiveDoc(null);
      return;
    }
    setView(id);
    setActiveDoc(null);
    setSidebarOpen(false);
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

  const shownDoc = docTabs.find((t) => t.doc.id === activeDoc)?.doc || null;
  const docMode = !!shownDoc;
  const minimized = docTabs.filter((t) => t.minimized);

  return (
    <StagesCtx.Provider value={stageDefs}>
    <div className="app">
      <header className="topbar">
        <button
          className="icon-btn hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open client list"
        >
          <Menu size={18} />
        </button>

        {/* the header IS the tab bar: home tab first, then document tabs */}
        <div className={`htab home ${docMode ? "" : "active"}`}>
          <button className="label" onClick={goHome}>
            <GoldStar size={20} />
            Clinic X CSM
          </button>
        </div>

        {docTabs.map(({ doc, minimized: isMin }) => {
          const tint = docTint(doc);
          return (
            <div key={doc.id} className={`htab ${activeDoc === doc.id ? "active" : ""}`}>
              <button className="label" onClick={() => openDoc(doc)} title={doc.name}>
                <span className="kind-chip" style={{ background: tint.bg, color: tint.color }}>
                  {doc.kind}
                </span>
                <span className="name">{doc.short || shortName(doc.name)}</span>
                {isMin && <span className="min-dash" title="Minimized to the corner" />}
              </button>
              <button
                className="tab-close"
                onClick={() => closeDoc(doc.id)}
                aria-label={`Close ${doc.name}`}
                title="Close tab"
              >
                <X size={11} />
              </button>
            </div>
          );
        })}

        <div className="spacer" />

        <button className="head-btn" onClick={() => window.print()}>
          <Printer size={14} />
          <span className="txt">Export checklist</span>
        </button>
        <button
          className={`icon-btn ${chatOpen ? "active" : ""}`}
          onClick={() => setChatOpen((v) => !v)}
          aria-label="Toggle Claude chat"
        >
          <MessageSquare size={18} />
        </button>
      </header>

      <div className="body">
        {/* tab-only view: no sidebar, no chat, no widgets while a doc is open */}
        {!docMode && (
          <Sidebar
            clients={clients}
            activeId={activeId}
            view={view}
            open={sidebarOpen}
            onPickClient={(id) => {
              setActiveId(id);
              setView("client");
              setActiveDoc(null);
              setSidebarOpen(false);
            }}
            onPickKaly={pickKaly}
            onAddClient={addClient}
            onRename={renameClient}
            onArchive={archiveClient}
          />
        )}

        <main className="main">
          {docMode ? (
            <DocPane
              doc={shownDoc}
              onMinimize={() => minimizeDoc(shownDoc.id)}
              onClose={() => closeDoc(shownDoc.id)}
            />
          ) : view === "client" ? (
            active && (
              <>
                <div className="pane-head">
                  <h1>{active.name}</h1>
                  <div className="sub">
                    <StageSelect
                      stage={active.stage}
                      onPick={(stage) => saveClient(active.id, { stage })}
                    />
                    {active.updatedAt && (
                      <span>Updated {new Date(active.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                  <Blockers client={active} saveClient={saveClient} />
                </div>

                <nav className="tabs">
                  {CLIENT_TABS.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        className={`tab ${tab === t.id ? "active" : ""}`}
                        onClick={() => setTab(t.id)}
                      >
                        <Icon size={15} style={{ verticalAlign: "-3px", marginRight: 6 }} />
                        {t.label}
                        <span className="underline" />
                      </button>
                    );
                  })}
                </nav>

                <div className="tab-body">
                  <PrintHead client={active} />
                  <ClientTab
                    tab={tab}
                    client={active}
                    saveClient={saveClient}
                    onOpenDoc={openDoc}
                  />
                </div>
              </>
            )
          ) : (
            <KalyPane
              view={view}
              personal={personal}
              savePersonal={savePersonal}
              settings={settings}
              saveSettings={saveSettings}
              onOpenDoc={openDoc}
            />
          )}
        </main>

        {!docMode && chatOpen && (
          <ChatPanel
            client={active}
            chatContext={settings.chatContext}
            onClose={() => setChatOpen(false)}
          />
        )}
      </div>

      {!docMode && minimized.length > 0 && (
        <div className="dock">
          {minimized.map(({ doc }) => {
            const tint = docTint(doc);
            return (
              <div className="dock-card" key={doc.id}>
                <span className="doc-tile" style={{ background: tint.bg, color: tint.color }}>
                  <FileText size={14} />
                </span>
                <span className="who">
                  <span className="name" title={doc.name}>
                    {doc.short || shortName(doc.name)}
                  </span>
                  <span className="src">{doc.source}</span>
                </span>
                <button className="mini-btn" onClick={() => openDoc(doc)} title="Maximize">
                  <Maximize2 size={12} />
                </button>
                <button
                  className="mini-btn close"
                  onClick={() => closeDoc(doc.id)}
                  title="Close"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {guideOpen && <StageGuide clients={clients} onClose={() => setGuideOpen(false)} />}

      {sidebarOpen && (
        <button className="overlay" onClick={() => setSidebarOpen(false)} aria-label="Close" />
      )}
    </div>
    </StagesCtx.Provider>
  );
}

// The stage badge IS the picker: click it, choose a stage, it saves to KV.
// Nothing derives the stage — this is the only thing that sets it.
function StageSelect({ stage, onPick }) {
  const defs = useStageDefs();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const def = stageDef(stage, defs);

  useEffect(() => {
    if (!open) return;
    const away = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <span className="stage-select" ref={ref}>
      <button
        className="pill stage-pill"
        style={{ background: def.bg, color: def.color }}
        onClick={() => setOpen((v) => !v)}
        title="Change stage"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        Stage · {def.name}
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="stage-menu" role="listbox">
          {defs.map((s) => (
            <button
              key={s.name}
              className="stage-opt"
              role="option"
              aria-selected={s.name === def.name}
              onClick={() => {
                onPick(s.name);
                setOpen(false);
              }}
            >
              <span className="pill" style={{ background: s.bg, color: s.color }}>
                {s.name}
              </span>
              {s.name === def.name && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}

// Warning pills, all hand-entered. Add one with a short line of text; the ×
// clears it once it's resolved. Nothing is seeded here.
function Blockers({ client, saveClient }) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const list = Array.isArray(client.blockers) ? client.blockers : [];

  function commit() {
    const t = text.trim();
    if (t) saveClient(client.id, { blockers: [...list, t] });
    setText("");
    setAdding(false);
  }
  function remove(i) {
    saveClient(client.id, { blockers: list.filter((_, j) => j !== i) });
  }

  return (
    <div className="blockers">
      {list.map((b, i) => (
        <span className="blocker-tag" key={i}>
          <AlertCircle size={12} />
          {b}
          <button
            className="tag-x"
            onClick={() => remove(i)}
            title="Resolved — remove"
            aria-label={`Remove blocker: ${b}`}
          >
            <X size={11} />
          </button>
        </span>
      ))}
      {adding ? (
        <span className="blocker-input">
          <AlertCircle size={12} />
          <input
            autoFocus
            value={text}
            placeholder="What's blocking?"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setText("");
                setAdding(false);
              }
            }}
            onBlur={commit}
          />
        </span>
      ) : (
        <button className="add-blocker" onClick={() => setAdding(true)}>
          <Plus size={12} />
          Add blocker
        </button>
      )}
    </div>
  );
}

function Sidebar({ clients, activeId, view, open, onPickClient, onPickKaly, onAddClient, onRename, onArchive }) {
  const [editing, setEditing] = useState(null); // client id being renamed
  const [draftName, setDraftName] = useState("");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const stageDefs = useStageDefs();
  const [newStage, setNewStage] = useState(stageDefs[0].name);

  function startRename(c) {
    setEditing(c.id);
    setDraftName(c.name);
  }
  function commitRename(id) {
    const n = draftName.trim();
    if (n) onRename(id, n);
    setEditing(null);
  }
  function submitNew() {
    const n = newName.trim();
    if (!n) return;
    onAddClient(n, newStage);
    setNewName("");
    setNewStage(stageDefs[0].name);
    setAdding(false);
  }

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="kaly-block">
        <div className="head">
          <User size={16} />
          Kaly’s Space
        </div>
        <div className="kaly-grid">
          {KALY_NAV.map((n) => {
            const Icon = n.icon;
            return (
              <button
                key={n.id}
                className={`kaly-btn ${view === n.id ? "active" : ""}`}
                onClick={() => onPickKaly(n.id)}
              >
                <Icon size={14} />
                {n.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="client-list">
        <div className="list-head">Clients · {clients.length}</div>
        {clients.map((c) => {
          const def = stageDef(c.stage, stageDefs);
          const isActive = view === "client" && c.id === activeId;
          const isEditing = editing === c.id;
          return (
            <div key={c.id} className={`client-row ${isActive ? "active" : ""}`}>
              {isEditing ? (
                <>
                  <ClientTile stage={c.stage} />
                  <input
                    autoFocus
                    className="rename-input"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitRename(c.id);
                      if (e.key === "Escape") setEditing(null);
                    }}
                    onBlur={() => commitRename(c.id)}
                  />
                </>
              ) : (
                <>
                  <button className="pick" onClick={() => onPickClient(c.id)}>
                    <ClientTile stage={c.stage} />
                    <span className="who">
                      <span className="name">{c.name}</span>
                      <span className="pill" style={{ background: def.bg, color: def.color }}>
                        {def.name}
                      </span>
                    </span>
                    {(c.blockers?.length ?? 0) > 0 && (
                      <span className="blocker-count">{c.blockers.length}</span>
                    )}
                  </button>
                  <span className="actions">
                    <button
                      className="row-action"
                      title="Rename"
                      onClick={() => startRename(c)}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      className="row-action danger"
                      title="Archive (data kept)"
                      onClick={() => {
                        if (window.confirm(`Archive ${c.name}? Its data is kept in KV and it just hides from the list.`))
                          onArchive(c.id);
                      }}
                    >
                      <Archive size={13} />
                    </button>
                  </span>
                </>
              )}
            </div>
          );
        })}

        {adding ? (
          <div className="add-client-form">
            <input
              autoFocus
              placeholder="Client name…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitNew()}
            />
            <select value={newStage} onChange={(e) => setNewStage(e.target.value)}>
              {stageDefs.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <div className="row">
              <button className="btn" style={{ flex: 1 }} onClick={submitNew}>
                Add
              </button>
              <button className="btn ghost" onClick={() => setAdding(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="add-client" onClick={() => setAdding(true)}>
            <Plus size={15} />
            Add Client
          </button>
        )}
      </div>
    </aside>
  );
}

function PrintHead({ client }) {
  const defs = useStageDefs();
  return (
    <div className="print-head">
      <h1>{client.name} — onboarding checklist</h1>
      <div className="sub">
        Stage · {stageDef(client.stage, defs).name} · printed{" "}
        {new Date().toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
}

function ClientTab({ tab, client, saveClient, onOpenDoc }) {
  if (tab === "checklist") return <Checklist client={client} saveClient={saveClient} />;
  if (tab === "notes") return <Notes client={client} saveClient={saveClient} />;
  if (tab === "meetings") return <Meetings client={client} saveClient={saveClient} />;
  if (tab === "documents")
    return <Documents client={client} saveClient={saveClient} onOpenDoc={onOpenDoc} />;
  return null;
}

function Checklist({ client, saveClient }) {
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const list = client.checklist || [];
  // legacy items are history from a deleted template step — they stay visible
  // but they don't move the bar or the denominator
  const live = list.filter((i) => !i.legacy);
  const doneCount = live.filter((i) => i.done).length;
  const pct = live.length ? Math.round((doneCount / live.length) * 100) : 0;

  function toggle(itemId) {
    const next = list.map((it) => (it.id === itemId ? { ...it, done: !it.done } : it));
    saveClient(client.id, { checklist: next });
  }

  function add() {
    const text = draft.trim();
    if (!text) return;
    // `custom` keeps it off the template: it lives on this client only and
    // survives every template sync
    saveClient(client.id, {
      checklist: [...list, { id: `c-${Date.now()}`, text, done: false, custom: true }],
    });
    setDraft("");
    setAdding(false);
  }

  return (
    <div className="fade-in print-block">
      <div className="progress-row">
        <div className="progress">
          <span style={{ width: `${pct}%` }} />
        </div>
        <span className="count">
          {doneCount} of {live.length} complete
        </span>
        <button className="add-btn mint" onClick={() => setAdding((v) => !v)}>
          <Plus size={13} />
          Add Item
        </button>
      </div>

      {adding && (
        <div className="inline-form">
          <input
            autoFocus
            value={draft}
            placeholder="Add a checklist item…"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <button className="btn" onClick={add}>
            Add
          </button>
        </div>
      )}

      <div className="stack">
        {list.map((it) => (
          <div
            key={it.id}
            className={`card check-item ${it.done ? "completed" : ""} ${
              it.legacy ? "legacy" : ""
            }`}
          >
            <button
              className={`box ${it.done ? "done" : ""}`}
              onClick={() => toggle(it.id)}
              aria-label={`Toggle ${it.text}`}
            >
              {it.done && <Check size={13} />}
            </button>
            <span className="txt">{it.text}</span>
            {it.legacy && (
              <span className="owner legacy-chip" title="Removed from the template — kept because it was checked">
                Legacy
              </span>
            )}
            {it.owner && (
              <span
                className="owner"
                style={{
                  background: (OWNER_TINT[it.owner] || OWNER_TINT.Kaly).bg,
                  color: (OWNER_TINT[it.owner] || OWNER_TINT.Kaly).color,
                }}
              >
                {it.owner}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Client notes tab — thin wrapper over the shared NotesEditor.
function Notes({ client, saveClient }) {
  return (
    <NotesEditor
      subject={client.name}
      notes={client.notes || ""}
      entries={client.noteEntries || []}
      onSaveNotes={(notes) => saveClient(client.id, { notes })}
      onSaveEntries={(noteEntries) => saveClient(client.id, { noteEntries })}
    />
  );
}

// Shared notes CRUD: a "Working notes" section (legacy `notes` string) plus a
// list of titled entries — each with editable title, editable body (save on
// blur), and delete-with-confirm.
function NotesEditor({ subject, notes, entries, onSaveNotes, onSaveEntries }) {
  const [text, setText] = useState(notes);
  const [open, setOpen] = useState({ working: true });
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => setText(notes), [subject]); // eslint-disable-line react-hooks/exhaustive-deps

  function addNote() {
    const t = title.trim();
    if (!t) return;
    const entry = { id: newId("n"), title: t, body: "", at: new Date().toISOString() };
    onSaveEntries([entry, ...entries]);
    setOpen((o) => ({ ...o, [entry.id]: true }));
    setTitle("");
    setAdding(false);
  }
  function patchEntry(id, patch) {
    onSaveEntries(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }
  function removeEntry(id) {
    onSaveEntries(entries.filter((e) => e.id !== id));
  }

  return (
    <div className="fade-in print-block">
      <div className="action-row">
        <span className="hint">
          {entries.length + 1} notes · newest first, each saved to KV on blur
        </span>
        <button className="add-btn violet" onClick={() => setAdding((v) => !v)}>
          <Plus size={13} />
          Add Note
        </button>
      </div>

      {adding && (
        <div className="inline-form">
          <input
            autoFocus
            value={title}
            placeholder="Note title — e.g. “Call with Dana · Aug 21”"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
          />
          <button className="btn" onClick={addNote}>
            Add
          </button>
        </div>
      )}

      <div className="stack">
        {entries.map((e) => (
          <NoteEntry
            key={e.id}
            entry={e}
            open={!!open[e.id]}
            onToggle={() => setOpen((o) => ({ ...o, [e.id]: !o[e.id] }))}
            onSaveTitle={(t) => patchEntry(e.id, { title: t })}
            onSaveBody={(body) => patchEntry(e.id, { body })}
            onDelete={() => removeEntry(e.id)}
          />
        ))}

        <Accordion
          title="Working notes"
          meta="saved on blur"
          open={!!open.working}
          onToggle={() => setOpen((o) => ({ ...o, working: !o.working }))}
        >
          <textarea
            className="notes-area"
            value={text}
            placeholder={`Notes for ${subject}…`}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => text !== notes && onSaveNotes(text)}
          />
        </Accordion>
      </div>
    </div>
  );
}

function NoteEntry({ entry, open, onToggle, onSaveTitle, onSaveBody, onDelete }) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(entry.title);
  const [body, setBody] = useState(entry.body || "");

  useEffect(() => setBody(entry.body || ""), [entry.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function commitTitle() {
    const t = draftTitle.trim();
    if (t && t !== entry.title) onSaveTitle(t);
    setEditingTitle(false);
  }

  return (
    <section className={`card acc ${open ? "open" : ""}`}>
      <div className="acc-head">
        <button
          className="row-action"
          onClick={onToggle}
          aria-expanded={open}
          style={{ padding: 0 }}
        >
          <ChevronRight className="chev" size={12} />
        </button>
        {editingTitle ? (
          <input
            autoFocus
            className="rename-input"
            style={{ flex: 1 }}
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle();
              if (e.key === "Escape") setEditingTitle(false);
            }}
            onBlur={commitTitle}
          />
        ) : (
          <button
            className="acc-title"
            style={{ background: "transparent", border: "none", textAlign: "left" }}
            onClick={onToggle}
          >
            {entry.title}
          </button>
        )}
        <span className="acc-meta">{new Date(entry.at).toLocaleDateString()}</span>
        <span className="entry-actions">
          <button className="row-action" title="Rename" onClick={() => { setDraftTitle(entry.title); setEditingTitle(true); }}>
            <Pencil size={13} />
          </button>
          <button
            className="row-action danger"
            title="Delete"
            onClick={() => window.confirm(`Delete note “${entry.title}”?`) && onDelete()}
          >
            <Trash2 size={13} />
          </button>
        </span>
      </div>
      {open && (
        <div className="acc-body">
          <textarea
            className="notes-area"
            style={{ minHeight: 140 }}
            value={body}
            placeholder="What happened, what’s next…"
            onChange={(e) => setBody(e.target.value)}
            onBlur={() => body !== (entry.body || "") && onSaveBody(body)}
          />
        </div>
      )}
    </section>
  );
}

function Accordion({ title, meta, open, onToggle, children }) {
  return (
    <section className={`card acc ${open ? "open" : ""}`}>
      <button className="acc-head" onClick={onToggle} aria-expanded={open}>
        <ChevronRight className="chev" size={12} />
        <span className="acc-title">{title}</span>
        <span className="acc-meta">{meta}</span>
      </button>
      {open && <div className="acc-body">{children}</div>}
    </section>
  );
}

const meetingSortKey = (m) => (m.date ? `${m.date}T${m.time || "00:00"}` : m.at || "");

function Meetings({ client, saveClient }) {
  const list = [...(client.meetings || [])].sort((a, b) =>
    meetingSortKey(b).localeCompare(meetingSortKey(a))
  );
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", notes: MEETING_TEMPLATE });

  function save(next) {
    saveClient(client.id, { meetings: next });
  }

  function add() {
    const t = form.title.trim();
    if (!t) return;
    const m = {
      id: newId("m"),
      title: t,
      date: form.date,
      time: form.time,
      notes: form.notes,
      at: new Date().toISOString(),
    };
    save([m, ...(client.meetings || [])]);
    setForm({ title: "", date: "", time: "", notes: MEETING_TEMPLATE });
    setAdding(false);
  }

  function update(id, patch) {
    save((client.meetings || []).map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }
  function remove(id) {
    save((client.meetings || []).filter((m) => m.id !== id));
  }

  return (
    <div className="fade-in">
      <div className="action-row">
        <span className="hint">Meetings, decisions, and promises — saved to KV.</span>
        <button className="add-btn pink" onClick={() => setAdding((v) => !v)}>
          <Plus size={13} />
          Add Meeting
        </button>
      </div>

      {adding && (
        <section className="card meeting-form">
          <div className="field">
            <label>Title</label>
            <input
              autoFocus
              value={form.title}
              placeholder="e.g. Weekly sync — website review"
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
            </div>
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea
              className="notes-area"
              style={{ minHeight: 200 }}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={add}>
              Save meeting
            </button>
            <button className="btn ghost" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </section>
      )}

      {list.length === 0 ? (
        <div className="empty">No meetings logged yet for {client.name}.</div>
      ) : (
        <div className="stack">
          {list.map((m) => (
            <MeetingCard key={m.id} meeting={m} onUpdate={update} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}

function MeetingCard({ meeting: m, onUpdate, onRemove }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(m);

  useEffect(() => setDraft(m), [m.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const when = m.date
    ? new Date(`${m.date}T${m.time || "00:00"}`).toLocaleString(undefined, {
        dateStyle: "medium",
        ...(m.time ? { timeStyle: "short" } : {}),
      })
    : `Added ${new Date(m.at).toLocaleDateString()}`;

  function saveEdit() {
    onUpdate(m.id, {
      title: draft.title.trim() || m.title,
      date: draft.date,
      time: draft.time,
      notes: draft.notes,
    });
    setEditing(false);
    setOpen(true);
  }

  return (
    <section className="card meeting-card">
      <div className="meeting-head">
        <span className="doc-tile" style={{ background: "#F8D7E8", color: "#96496C" }}>
          <CalendarDays size={16} />
        </span>
        <button className="who" onClick={() => setOpen((v) => !v)}>
          <span className="name">{m.title}</span>
          <span className="when">{when}</span>
        </button>
        <div className="meeting-actions">
          <a className="gcal-btn" href={gcalUrl(m)} target="_blank" rel="noopener noreferrer">
            <CalendarPlus size={13} />
            Google Calendar
          </a>
          <button className="row-action" title="Edit" onClick={() => { setEditing(true); setOpen(true); }}>
            <Edit3 size={14} />
          </button>
          <button
            className="row-action danger"
            title="Delete"
            onClick={() => window.confirm(`Delete meeting “${m.title}”?`) && onRemove(m.id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {open && (
        <div className="meeting-body">
          {editing ? (
            <>
              <div className="field-row" style={{ marginTop: 12 }}>
                <div className="field">
                  <label>Title</label>
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Date</label>
                  <input
                    type="date"
                    value={draft.date || ""}
                    onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                  />
                </div>
                <div className="field">
                  <label>Time</label>
                  <input
                    type="time"
                    value={draft.time || ""}
                    onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))}
                  />
                </div>
              </div>
              <textarea
                className="notes-area"
                value={draft.notes || ""}
                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className="btn" onClick={saveEdit}>
                  <Save size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
                  Save
                </button>
                <button className="btn ghost" onClick={() => { setEditing(false); setDraft(m); }}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <textarea
              className="notes-area"
              value={m.notes || ""}
              placeholder="Meeting notes…"
              onChange={() => {}}
              onFocus={() => setEditing(true)}
              readOnly
            />
          )}
        </div>
      )}
    </section>
  );
}

// Client documents tab.
function Documents({ client, saveClient, onOpenDoc }) {
  return (
    <DocsManager
      docs={client.documents || []}
      folders={client.folders || []}
      linkKind="DOC"
      owner={client.name}
      scopeLabel={`Client file · ${client.name}`}
      accentClass="peach"
      onSaveDocs={(documents) => saveClient(client.id, { documents })}
      onSaveFolders={(folders) => saveClient(client.id, { folders })}
      onOpenDoc={onOpenDoc}
    />
  );
}

const MAX_UPLOAD = 2 * 1024 * 1024; // 2MB
const fmtBytes = (n) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1048576).toFixed(1)} MB`);
const fileKind = (mime) => (mime?.startsWith("image/") ? "IMG" : mime === "application/pdf" ? "PDF" : "FILE");

// Shared documents manager: drag/drop + file-picker upload (base64 in KV, ≤2MB),
// external links, named folders, rename + delete on docs and folders.
function DocsManager({ docs, folders, linkKind, owner, scopeLabel, accentClass, onSaveDocs, onSaveFolders, onOpenDoc }) {
  const [addingLink, setAddingLink] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [drag, setDrag] = useState(false);
  const fileRef = useRef(null);

  async function ingestFiles(files) {
    const additions = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_UPLOAD) {
        window.alert(`“${file.name}” is ${fmtBytes(file.size)} — over 2MB. Add it as a link instead.`);
        continue;
      }
      const fileData = await fileToDataURL(file);
      additions.push({
        id: newId("d"),
        kind: fileKind(file.type),
        name: file.name,
        short: shortName(file.name),
        typeLabel: file.type || "File",
        owner,
        source: "Uploaded",
        mime: file.type,
        size: file.size,
        fileData,
        folderId: null,
        updated: new Date().toISOString(),
        scope: scopeLabel,
      });
    }
    if (additions.length) onSaveDocs([...docs, ...additions]);
  }

  function addLink() {
    const n = name.trim();
    if (!n) return;
    onSaveDocs([
      ...docs,
      {
        id: newId("d"),
        kind: linkKind,
        name: n,
        short: shortName(n),
        typeLabel: "External link",
        owner,
        source: sourceFromUrl(url),
        url: url.trim(),
        folderId: null,
        updated: new Date().toISOString(),
        scope: scopeLabel,
      },
    ]);
    setName("");
    setUrl("");
    setAddingLink(false);
  }

  function patchDoc(id, patch) {
    onSaveDocs(docs.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }
  function removeDoc(id) {
    onSaveDocs(docs.filter((d) => d.id !== id));
  }
  function renameDoc(d) {
    const n = window.prompt("Rename document", d.name);
    if (n && n.trim()) patchDoc(d.id, { name: n.trim(), short: shortName(n.trim()) });
  }

  function addFolder() {
    const n = window.prompt("New folder name");
    if (n && n.trim()) onSaveFolders([...folders, { id: newId("f"), name: n.trim() }]);
  }
  function renameFolder(f) {
    const n = window.prompt("Rename folder", f.name);
    if (n && n.trim()) onSaveFolders(folders.map((x) => (x.id === f.id ? { ...x, name: n.trim() } : x)));
  }
  function deleteFolder(f) {
    if (!window.confirm(`Delete folder “${f.name}”? Its documents move to General.`)) return;
    onSaveFolders(folders.filter((x) => x.id !== f.id));
    onSaveDocs(docs.map((d) => (d.folderId === f.id ? { ...d, folderId: null } : d)));
  }

  const groups = [
    ...folders.map((f) => ({ folder: f, items: docs.filter((d) => d.folderId === f.id) })),
    {
      folder: null,
      items: docs.filter((d) => !d.folderId || !folders.some((f) => f.id === d.folderId)),
    },
  ];

  return (
    <div className="fade-in">
      <div className="action-row">
        <span className="hint">Upload images / PDFs (≤2MB) or add external links. Organize with folders.</span>
        <button className="add-btn mint" onClick={addFolder}>
          <FolderPlus size={13} />
          New Folder
        </button>
        <button className={`add-btn ${accentClass}`} onClick={() => setAddingLink((v) => !v)}>
          <Plus size={13} />
          Add Link
        </button>
      </div>

      <div
        className={`dropzone ${drag ? "drag" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); ingestFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
      >
        <Upload size={20} />
        <span>
          Drag files here, or <span className="pick-link">browse</span> — images & PDFs up to 2MB
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          hidden
          onChange={(e) => { ingestFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {addingLink && (
        <div className="inline-form">
          <input
            autoFocus
            value={name}
            placeholder="Document name…"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            value={url}
            placeholder="Link (Drive, Notion, Sheets, …)"
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addLink()}
          />
          <button className="btn" onClick={addLink}>
            Add
          </button>
        </div>
      )}

      {docs.length === 0 ? (
        <div className="empty">No documents yet. Upload a file or add a link.</div>
      ) : (
        groups.map(({ folder, items }) =>
          items.length === 0 && folder === null ? null : (
            <div className="folder-group" key={folder?.id || "general"}>
              <div className="folder-head">
                <Folder size={13} />
                <span className="folder-title">{folder ? folder.name : "General"}</span>
                <span className="spacer" />
                {folder && (
                  <>
                    <button className="row-action" title="Rename folder" onClick={() => renameFolder(folder)}>
                      <Pencil size={13} />
                    </button>
                    <button className="row-action danger" title="Delete folder" onClick={() => deleteFolder(folder)}>
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
              <div className="stack">
                {items.length === 0 ? (
                  <div className="empty" style={{ padding: 20 }}>Empty folder.</div>
                ) : (
                  items.map((d) => (
                    <DocRow
                      key={d.id}
                      doc={d}
                      folders={folders}
                      onOpenDoc={onOpenDoc}
                      onMove={(folderId) => patchDoc(d.id, { folderId })}
                      onRename={() => renameDoc(d)}
                      onDelete={() => window.confirm(`Delete “${d.name}”?`) && removeDoc(d.id)}
                    />
                  ))
                )}
              </div>
            </div>
          )
        )
      )}
    </div>
  );
}

function DocRow({ doc: d, folders, onOpenDoc, onMove, onRename, onDelete }) {
  const tint = docTint(d);
  const Icon = d.mime?.startsWith("image/") ? Image : FileText;
  return (
    <div className="card doc-row">
      <span className="doc-tile" style={{ background: tint.bg, color: tint.color }}>
        <Icon size={15} />
      </span>
      <span className="who">
        <span className="name">{d.name}</span>
        <span className="meta">
          {[d.kind, d.source, d.size && fmtBytes(d.size), d.updated && `updated ${new Date(d.updated).toLocaleDateString()}`]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </span>
      <select
        className="doc-folder-select"
        value={d.folderId || ""}
        onChange={(e) => onMove(e.target.value || null)}
        title="Move to folder"
      >
        <option value="">General</option>
        {folders.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      <div className="doc-actions">
        <button className="row-action" title="Rename" onClick={onRename}>
          <Pencil size={14} />
        </button>
        <button className="row-action danger" title="Delete" onClick={onDelete}>
          <Trash2 size={14} />
        </button>
        <button className="link-btn" onClick={() => onOpenDoc(d)}>
          Open
        </button>
      </div>
    </div>
  );
}

function KalyPane({ view, personal, savePersonal, settings, saveSettings, onOpenDoc }) {
  const titles = {
    "personal-notes": "Personal Notes",
    "personal-docs": "Reference Docs",
    settings: "Settings",
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}>
      <div className="pane-head" style={{ paddingBottom: 20, borderBottom: "1px solid var(--line)" }}>
        <div className="title-row">
          <User size={19} color="#8B6DAE" />
          <h1>{titles[view] || "Kaly’s Space"}</h1>
        </div>
        <div className="sub">
          <span className="pill" style={{ background: "#F3E4F8", color: "#6B4C8A", marginTop: 0 }}>
            Kaly’s Space
          </span>
          <span>Saved to KV under user_kaly_dashboard · not attached to any client</span>
        </div>
      </div>

      <div className="tab-body">
        {view === "personal-notes" && (
          <NotesEditor
            subject="Kaly"
            notes={personal.notes || ""}
            entries={personal.noteEntries || []}
            onSaveNotes={(notes) => savePersonal({ notes })}
            onSaveEntries={(noteEntries) => savePersonal({ noteEntries })}
          />
        )}
        {view === "personal-docs" && (
          <DocsManager
            docs={personal.docs || []}
            folders={personal.folders || []}
            linkKind="REF"
            owner="Kaly"
            scopeLabel="Reference · Kaly’s Space"
            accentClass="violet"
            onSaveDocs={(docs) => savePersonal({ docs })}
            onSaveFolders={(folders) => savePersonal({ folders })}
            onOpenDoc={onOpenDoc}
          />
        )}
        {view === "settings" && <SettingsPane settings={settings} saveSettings={saveSettings} />}
      </div>
    </div>
  );
}

function SettingsPane({ settings, saveSettings }) {
  const [items, setItems] = useState(
    settings.defaultChecklist && settings.defaultChecklist.length
      ? settings.defaultChecklist
      : []
  );
  const [dirty, setDirty] = useState(false);
  const [grab, setGrab] = useState(null); // row armed for dragging by its handle
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [stages, setStages] = useState(settings.stages || DEFAULT_STAGE_NAMES);
  const [stagesDirty, setStagesDirty] = useState(false);

  useEffect(() => {
    setItems(settings.defaultChecklist || []);
    setDirty(false);
  }, [settings.defaultChecklist]);

  useEffect(() => {
    setStages(settings.stages?.length ? settings.stages : DEFAULT_STAGE_NAMES);
    setStagesDirty(false);
  }, [settings.stages]);

  function editStage(i, val) {
    setStages((prev) => prev.map((t, j) => (j === i ? val : t)));
    setStagesDirty(true);
  }
  function removeStage(i) {
    setStages((prev) => prev.filter((_, j) => j !== i));
    setStagesDirty(true);
  }
  function addStage() {
    setStages((prev) => [...prev, ""]);
    setStagesDirty(true);
  }
  function saveStages() {
    const cleaned = stages.map((t) => t.trim()).filter(Boolean);
    // an empty list would leave the badge with nothing to offer
    const next = cleaned.length ? cleaned : DEFAULT_STAGE_NAMES;
    saveSettings({ stages: next });
    setStages(next);
    setStagesDirty(false);
  }

  // Template rows are {id, text}. The id is what carries a client's tick
  // across a rename or a reorder, so it is never regenerated here.
  function edit(i, val) {
    setItems((prev) => prev.map((t, j) => (j === i ? { ...t, text: val } : t)));
    setDirty(true);
  }
  function removeAt(i) {
    setItems((prev) => prev.filter((_, j) => j !== i));
    setDirty(true);
  }
  function addRow() {
    setItems((prev) => [...prev, { id: newId("tpl"), text: "" }]);
    setDirty(true);
  }
  function move(from, to) {
    if (to < 0 || to >= items.length || from === to) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDirty(true);
  }
  function saveTemplate() {
    const cleaned = items
      .map((t) => ({ ...t, text: t.text.trim() }))
      .filter((t) => t.text);
    saveSettings({ defaultChecklist: cleaned });
    setItems(cleaned);
    setDirty(false);
  }

  return (
    <div className="stack fade-in">
      <section className="card setting-card">
        <h3>Chat context</h3>
        <div className="desc">
          Include the active client’s stage, blockers, and notes in each Claude chat request.
        </div>
        <button
          className={`toggle ${settings.chatContext ? "on" : ""}`}
          onClick={() => saveSettings({ chatContext: !settings.chatContext })}
        >
          <span className="track" />
          {settings.chatContext ? "On — Claude sees client context" : "Off — generic assistant"}
        </button>
      </section>

      <section className="card setting-card">
        <h3>Client stages</h3>
        <div className="desc">
          The list the stage badge offers on each client. Stage is set by hand and is
          independent of the checklist — nothing moves a client along for you. Renaming a stage
          here doesn’t re-stage clients already sitting on the old name.
        </div>
        {stages.map((t, i) => (
          <div className="template-row" key={i}>
            <span className="num">{i + 1}</span>
            <input
              value={t}
              onChange={(e) => editStage(i, e.target.value)}
              placeholder="Stage name…"
            />
            <button
              className="row-action danger"
              title="Remove"
              onClick={() => removeStage(i)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="add-btn pink" onClick={addStage}>
            <Plus size={13} />
            Add stage
          </button>
          <button className="btn" onClick={saveStages} disabled={!stagesDirty}>
            <Save size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
            Save stages
          </button>
        </div>
      </section>

      <section className="card setting-card">
        <h3>Default checklist template</h3>
        <div className="desc">
          The order and wording every client follows. Drag a row by its handle, or use the
          arrows, to reorder.
        </div>
        {items.map((t, i) => (
          <div
            className={`template-row ${dragIdx === i ? "dragging" : ""} ${
              overIdx === i && dragIdx !== i ? "drop-target" : ""
            }`}
            key={t.id}
            draggable={grab === i}
            onDragStart={() => setDragIdx(i)}
            onDragEnd={() => {
              setDragIdx(null);
              setOverIdx(null);
              setGrab(null);
            }}
            onDragOver={(e) => {
              if (dragIdx === null) return;
              e.preventDefault();
              setOverIdx(i);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIdx !== null) move(dragIdx, i);
              setDragIdx(null);
              setOverIdx(null);
              setGrab(null);
            }}
          >
            <button
              className="drag-handle"
              title="Drag to reorder"
              aria-label={`Drag to reorder ${t.text}`}
              onMouseDown={() => setGrab(i)}
              onMouseUp={() => setGrab(null)}
            >
              <GripVertical size={14} />
            </button>
            <span className="num">{i + 1}</span>
            <input
              value={t.text}
              onChange={(e) => edit(i, e.target.value)}
              placeholder="Checklist step…"
            />
            <button
              className="row-action"
              title="Move up"
              aria-label={`Move ${t.text} up`}
              disabled={i === 0}
              onClick={() => move(i, i - 1)}
            >
              <ChevronUp size={14} />
            </button>
            <button
              className="row-action"
              title="Move down"
              aria-label={`Move ${t.text} down`}
              disabled={i === items.length - 1}
              onClick={() => move(i, i + 1)}
            >
              <ChevronDown size={14} />
            </button>
            <button className="row-action danger" title="Remove" onClick={() => removeAt(i)}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="add-btn mint" onClick={addRow}>
            <Plus size={13} />
            Add step
          </button>
          <button className="btn" onClick={saveTemplate} disabled={!dirty}>
            <Save size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
            Save template
          </button>
        </div>
        <div className="apply-note">
          Applies to all clients. Order and wording sync everywhere; each client keeps its own
          ticks. A step you delete stays on any client that already checked it, marked Legacy.
          Items added on a client stay on that client.
        </div>
      </section>
    </div>
  );
}

function DocPane({ doc, onMinimize, onClose }) {
  const tint = docTint(doc);
  const isImage = doc.fileData && doc.mime?.startsWith("image/");
  const isPdf = doc.fileData && doc.mime === "application/pdf";
  const [zoom, setZoom] = useState(1);
  const [fit, setFit] = useState(true);

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}>
      <div className="doc-pane-head">
        <span className="doc-tile" style={{ background: tint.bg, color: tint.color }}>
          {isImage ? <Image size={20} /> : <FileText size={20} />}
        </span>
        <span className="who" style={{ flex: 1, minWidth: 0 }}>
          <h1>{doc.name}</h1>
          <span className="meta" style={{ fontSize: 12.5, color: "var(--muted)" }}>
            {doc.scope || doc.typeLabel}
          </span>
        </span>
        <button className="btn ghost" onClick={onMinimize} title="Minimize to corner">
          <Minimize2 size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />
          Minimize
        </button>
        <button className="mini-btn close" onClick={onClose} title="Close tab">
          <X size={14} />
        </button>
      </div>

      {isImage && (
        <div className="preview-toolbar">
          <button className="mini-btn" title="Zoom out" onClick={() => { setFit(false); setZoom((z) => Math.max(0.25, z - 0.25)); }}>
            <ZoomOut size={14} />
          </button>
          <span className="zoom-label">{fit ? "Fit" : `${Math.round(zoom * 100)}%`}</span>
          <button className="mini-btn" title="Zoom in" onClick={() => { setFit(false); setZoom((z) => Math.min(4, z + 0.25)); }}>
            <ZoomIn size={14} />
          </button>
          <button className="btn ghost" onClick={() => { setFit(true); setZoom(1); }}>
            <Maximize2 size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />
            Fit width
          </button>
        </div>
      )}

      {isImage ? (
        <div className="preview-wrap">
          <img
            className="preview-img"
            src={doc.fileData}
            alt={doc.name}
            style={fit ? { maxWidth: "100%" } : { width: `${zoom * 100}%`, maxWidth: "none" }}
          />
        </div>
      ) : isPdf ? (
        <div className="tab-body">
          <embed className="preview-pdf" src={doc.fileData} type="application/pdf" />
        </div>
      ) : (
        <div className="tab-body">
          <section className="card" style={{ maxWidth: 660, overflow: "hidden" }}>
            <dl className="doc-facts">
              <dt>Type</dt>
              <dd>{doc.typeLabel || doc.kind}</dd>
              <dt>Updated</dt>
              <dd>{doc.updated ? new Date(doc.updated).toLocaleDateString() : "—"}</dd>
              <dt>Owner</dt>
              <dd>{doc.owner || "—"}</dd>
              <dt>Source</dt>
              <dd>{doc.source || "External"}</dd>
            </dl>
            <div className="doc-open">
              {doc.url ? (
                <a className="ext" href={doc.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} />
                  Open in {doc.source || "source"}
                </a>
              ) : (
                <span className="note">No link or file on this document yet.</span>
              )}
              <span className="note">
                External links open in the original app — nothing is previewed or edited here.
              </span>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function StageGuide({ clients, onClose }) {
  const defs = useStageDefs();
  return (
    <div className="veil" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span style={{ flex: 1, minWidth: 0 }}>
            <h2>Client stage guide</h2>
            <span className="sub">
              Stages in order, as set in Settings. Badge colors match the sidebar pills.
            </span>
          </span>
          <button className="mini-btn" onClick={onClose} aria-label="Close">
            <X size={14} />
          </button>
        </div>
        <div className="modal-body">
          {defs.map((s) => {
            const n = clients.filter((c) => stageDef(c.stage, defs).name === s.name).length;
            return (
              <div className="stage-row" key={s.name}>
                <span className="badge" style={{ background: s.bg, color: s.color }}>
                  {s.name}
                </span>
                <span className="desc">{s.desc}</span>
                <span className="count">{n === 0 ? "—" : `${n} client${n > 1 ? "s" : ""}`}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChatPanel({ client, chatContext, onClose }) {
  const stageDefs = useStageDefs();
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
      // Only send client context when the setting is on.
      const ctx = chatContext && client
        ? {
            name: client.name,
            stage: stageDef(client.stage, stageDefs).name,
            blockers: client.blockers,
            notes: client.notes,
          }
        : null;
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, client: ctx }),
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
    <aside className="chat">
      <div className="chat-head">
        <MessageSquare size={17} />
        <span className="who">
          <span className="title">Claude — CSM assistant</span>
          <span className="sub">
            {!chatContext
              ? "Context off · generic assistant"
              : client
              ? `Context: ${client.name} · ${stageDef(client.stage, stageDefs).name}`
              : "No client"}
          </span>
        </span>
        <button className="mini-btn" onClick={onClose} aria-label="Close chat">
          <X size={14} />
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

function sourceFromUrl(url = "") {
  const u = url.toLowerCase();
  if (u.includes("notion")) return "Notion";
  if (u.includes("docs.google")) return "Google Docs";
  if (u.includes("sheets.google")) return "Sheets";
  if (u.includes("drive.google")) return "Drive";
  if (u.includes("dropbox")) return "Dropbox";
  return "External";
}
