const pptxgen = require("pptxgenjs");
const path = require("node:path");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Codex Mission Control";
pptx.subject = "Hackathon pitch deck";
pptx.title = "Codex Mission Control - AI Software Execution Operating System";
pptx.company = "Codex Community Hackathon Pune";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "en-US"
};
pptx.defineLayout({ name: "MISSION", width: 13.333, height: 7.5 });
pptx.layout = "MISSION";

const C = {
  bg: "06111F",
  panel: "0B1727",
  panel2: "10233A",
  line: "24425C",
  white: "F2F7FB",
  muted: "B8C3CF",
  dim: "6D7E91",
  cyan: "8EF0FF",
  cyan2: "16C7E8",
  lime: "C2FF66",
  amber: "FDE68A",
  rose: "FDA4AF",
  sky: "7DD3FC",
  violet: "C4B5FD"
};

function addBg(slide, title, kicker = "CODEX MISSION CONTROL") {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: C.bg }, line: { color: C.bg } });
  slide.addShape(pptx.ShapeType.arc, { x: -1.4, y: -1.1, w: 5, h: 5, line: { color: C.cyan, transparency: 78, width: 1.2 } });
  slide.addShape(pptx.ShapeType.arc, { x: 9.2, y: -1.5, w: 5.6, h: 5.6, line: { color: C.lime, transparency: 84, width: 1 } });
  slide.addText(kicker, { x: 0.55, y: 0.32, w: 4.9, h: 0.22, fontFace: "Aptos", fontSize: 7.5, bold: true, color: C.cyan, charSpace: 1.4, margin: 0 });
  if (title) {
    slide.addText(title, { x: 0.55, y: 0.72, w: 9.5, h: 0.62, fontFace: "Aptos Display", fontSize: 27, bold: true, color: C.white, margin: 0 });
  }
  slide.addText("AI Software Execution Operating System", { x: 9.0, y: 0.34, w: 3.75, h: 0.22, fontSize: 7.5, color: C.dim, align: "right", margin: 0 });
}

function pill(slide, text, x, y, w, color = C.cyan, txt = C.bg) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 0.33, rectRadius: 0.08, fill: { color }, line: { color, transparency: 100 } });
  slide.addText(text, { x, y: y + 0.075, w, h: 0.13, fontSize: 7.5, bold: true, color: txt, align: "center", margin: 0 });
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.08,
    fill: { color: opts.fill || C.panel, transparency: opts.transparency ?? 3 },
    line: { color: opts.line || C.line, transparency: opts.lineT ?? 18, width: opts.width || 1 }
  });
}

function text(slide, t, x, y, w, h, opts = {}) {
  slide.addText(t, {
    x, y, w, h,
    fontFace: opts.fontFace || "Aptos",
    fontSize: opts.size || 14,
    bold: opts.bold || false,
    color: opts.color || C.white,
    margin: opts.margin ?? 0.04,
    breakLine: false,
    fit: "shrink",
    valign: opts.valign || "top",
    align: opts.align || "left",
    charSpace: opts.charSpace || 0
  });
}

function bullet(slide, items, x, y, w, opts = {}) {
  const runs = [];
  items.forEach((item, idx) => {
    runs.push({ text: `• ${item}${idx === items.length - 1 ? "" : "\n"}`, options: { breakLine: idx !== items.length - 1 } });
  });
  slide.addText(runs, {
    x, y, w, h: opts.h || 1.35,
    fontSize: opts.size || 12.2,
    color: opts.color || C.muted,
    margin: 0.04,
    breakLine: false,
    fit: "shrink",
    paraSpaceAfterPt: 2
  });
}

function node(slide, label, detail, x, y, w, h, color = C.cyan) {
  card(slide, x, y, w, h, { fill: "081421", line: color, lineT: 32 });
  slide.addShape(pptx.ShapeType.ellipse, { x: x + 0.16, y: y + 0.16, w: 0.28, h: 0.28, fill: { color }, line: { color } });
  text(slide, label, x + 0.55, y + 0.16, w - 0.68, 0.22, { size: 10.5, bold: true });
  text(slide, detail, x + 0.18, y + 0.55, w - 0.36, h - 0.64, { size: 8.7, color: C.muted });
}

function arrow(slide, x1, y1, x2, y2, color = C.cyan) {
  slide.addShape(pptx.ShapeType.line, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color, width: 1.25, beginArrowType: "none", endArrowType: "triangle" } });
}

function metric(slide, label, value, x, y, color) {
  card(slide, x, y, 2.7, 1.2, { fill: C.panel, line: color, lineT: 28 });
  text(slide, value, x + 0.18, y + 0.17, 2.34, 0.38, { size: 23, bold: true, color });
  text(slide, label, x + 0.18, y + 0.68, 2.34, 0.22, { size: 8.5, color: C.muted, charSpace: 0.6 });
}

// 1. Hero
{
  const s = pptx.addSlide();
  addBg(s, "");
  pill(s, "HACKATHON PITCH", 0.58, 0.82, 1.55, C.cyan);
  text(s, "Codex Mission Control", 0.55, 1.3, 7.8, 0.62, { fontFace: "Aptos Display", size: 37, bold: true });
  text(s, "The AI Software Execution Operating System", 0.58, 2.02, 7.5, 0.42, { size: 18, color: C.cyan, bold: true });
  text(s, "Transforms raw software ideas into PRDs, technical designs, engineering plans, AI execution packs, architecture maps, risk models, and traceable execution workflows.", 0.6, 2.72, 6.3, 1.2, { size: 16, color: C.muted });
  metric(s, "DOCUMENT OUTPUTS", "4", 0.6, 5.45, C.cyan);
  metric(s, "TRACEABLE SYSTEM", "1", 3.55, 5.45, C.lime);
  metric(s, "CODEX-READY CONTEXT", "AI", 6.5, 5.45, C.amber);
  s.addShape(pptx.ShapeType.ellipse, { x: 8.7, y: 1.35, w: 3.4, h: 3.4, fill: { color: "0B1727", transparency: 3 }, line: { color: C.cyan, transparency: 30, width: 1.5 } });
  s.addShape(pptx.ShapeType.ellipse, { x: 9.2, y: 1.85, w: 2.4, h: 2.4, fill: { color: "10233A", transparency: 8 }, line: { color: C.lime, transparency: 38, width: 1 } });
  ["PRD", "TDD", "PLAN", "AI PACK"].forEach((p, i) => pill(s, p, 8.55 + (i % 2) * 2.3, 5.1 + Math.floor(i / 2) * 0.58, 1.35, [C.cyan, C.lime, C.sky, C.amber][i]));
  text(s, "Built for the Codex Community Hackathon Pune", 8.55, 6.45, 3.9, 0.25, { size: 9.5, color: C.dim, align: "center" });
}

// 2. Problem
{
  const s = pptx.addSlide();
  addBg(s, "The real gap is not code. It is execution context.");
  card(s, 0.6, 1.55, 5.75, 4.8, { fill: "081421", line: C.rose, lineT: 35 });
  text(s, "Current AI workflow", 0.95, 1.88, 3.4, 0.3, { size: 16, bold: true, color: C.rose });
  bullet(s, [
    "Ideas become long chat threads",
    "Requirements, architecture, risks and decisions drift apart",
    "Teams copy/paste context into docs, tickets and AI tools",
    "No clear trace from goal to task to decision"
  ], 0.95, 2.45, 4.9, { h: 2.2, size: 13 });
  card(s, 6.95, 1.55, 5.75, 4.8, { fill: "081421", line: C.cyan, lineT: 35 });
  text(s, "What teams need", 7.3, 1.88, 3.6, 0.3, { size: 16, bold: true, color: C.cyan });
  bullet(s, [
    "A system of record between idea and execution",
    "Production-ready documents, not raw AI text",
    "Visual traceability across goals, risks and architecture",
    "Reusable context for Codex and other execution agents"
  ], 7.3, 2.45, 4.9, { h: 2.2, size: 13 });
  arrow(s, 5.95, 3.95, 7.0, 3.95, C.lime);
  text(s, "Mission Control turns scattered thinking into execution intelligence.", 2.2, 6.75, 9.0, 0.32, { size: 15, bold: true, color: C.lime, align: "center" });
}

// 3. Solution
{
  const s = pptx.addSlide();
  addBg(s, "Solution: an AI execution control plane");
  text(s, "Codex Mission Control is not another code generator. It is the operating layer that converts software intent into structured, explainable, reusable execution knowledge.", 0.7, 1.4, 11.8, 0.58, { size: 17, color: C.muted, align: "center" });
  const items = [
    ["Idea intake", "Objective, repo context, constraints", C.cyan],
    ["Mission plan", "Tasks, owners, dependencies", C.sky],
    ["Intelligence pass", "Artifacts, logs, risks, summary", C.lime],
    ["Document studio", "PRD, TDD, engineering plan, AI pack", C.amber],
    ["Traceability", "Goal to requirement to task to risk", C.violet]
  ];
  items.forEach(([label, detail, color], i) => {
    node(s, label, detail, 0.7 + i * 2.45, 3.0, 2.0, 1.5, color);
    if (i < items.length - 1) arrow(s, 2.68 + i * 2.45, 3.76, 3.08 + i * 2.45, 3.76, C.cyan);
  });
  card(s, 1.1, 5.85, 11.1, 0.78, { fill: C.panel2, line: C.cyan, lineT: 55 });
  text(s, "Outcome: a mission becomes a living execution system that humans and AI tools can both understand.", 1.35, 6.08, 10.6, 0.24, { size: 14.5, color: C.white, bold: true, align: "center" });
}

// 4. Product proof
{
  const s = pptx.addSlide();
  addBg(s, "Product proof: one mission produces four handoff artifacts");
  const docs = [
    ["PRD", "Executive-ready product requirements", C.cyan],
    ["Technical Design", "Engineer-ready architecture and data flow", C.lime],
    ["Engineering Plan", "Sprint-ready epics, stories and estimates", C.sky],
    ["AI Execution Pack", "Context package for Codex/external tools", C.amber]
  ];
  docs.forEach(([label, detail, color], i) => {
    const x = 0.8 + (i % 2) * 6.0;
    const y = 1.55 + Math.floor(i / 2) * 2.15;
    card(s, x, y, 5.35, 1.58, { fill: "081421", line: color, lineT: 28 });
    text(s, label, x + 0.3, y + 0.22, 4.6, 0.28, { size: 17, bold: true, color });
    text(s, detail, x + 0.3, y + 0.72, 4.65, 0.32, { size: 12.2, color: C.muted });
    pill(s, "Saved locally", x + 0.3, y + 1.12, 1.35, C.lime);
  });
  text(s, "Caching is intentional: switching tabs does not regenerate documents. Regenerate is an explicit user action.", 1.0, 6.48, 11.2, 0.3, { size: 13.2, color: C.cyan, bold: true, align: "center" });
}

// 5. Traceability
{
  const s = pptx.addSlide();
  addBg(s, "Traceability map: every task has a reason");
  node(s, "Goal", "Build an execution-ready software mission", 0.7, 2.85, 2.0, 1.1, C.cyan);
  node(s, "Requirement", "What must be true for the product", 3.25, 1.65, 2.2, 1.1, C.lime);
  node(s, "Task", "Specific execution step with owner", 6.0, 1.65, 2.1, 1.1, C.sky);
  node(s, "Architecture", "Affected system component", 8.7, 1.65, 2.3, 1.1, C.amber);
  node(s, "Risk", "What could break or mislead", 3.25, 4.25, 2.2, 1.1, C.rose);
  node(s, "Decision", "Why this stack/design choice", 6.0, 4.25, 2.1, 1.1, C.violet);
  node(s, "Document", "PRD/TDD/Plan/AI Pack output", 8.7, 4.25, 2.3, 1.1, C.cyan);
  arrow(s, 2.7, 3.36, 3.25, 2.2, C.cyan);
  arrow(s, 5.45, 2.2, 6.0, 2.2, C.lime);
  arrow(s, 8.1, 2.2, 8.7, 2.2, C.sky);
  arrow(s, 2.7, 3.36, 3.25, 4.78, C.rose);
  arrow(s, 5.45, 4.78, 6.0, 4.78, C.violet);
  arrow(s, 8.1, 4.78, 8.7, 4.78, C.cyan);
  text(s, "This is the product moat: not just generating text, but preserving why work exists.", 1.4, 6.55, 10.7, 0.3, { size: 14.5, color: C.lime, bold: true, align: "center" });
}

// 6. Architecture
{
  const s = pptx.addSlide();
  addBg(s, "Architecture: cloud-style execution intelligence system");
  node(s, "Users", "Founders, PMs, engineers, agencies", 0.55, 2.7, 1.4, 1.0, C.cyan);
  node(s, "Edge", "CDN / WAF / routing boundary", 2.35, 2.7, 1.6, 1.0, C.sky);
  card(s, 4.45, 1.42, 4.2, 3.7, { fill: "0A1A2E", line: C.lime, lineT: 28 });
  text(s, "Application VPC", 5.55, 1.68, 2.0, 0.24, { size: 11, bold: true, color: C.lime, align: "center" });
  node(s, "Web App", "Mission dashboard + studio", 4.8, 2.1, 1.55, 0.9, C.cyan);
  node(s, "API Server", "Validation + orchestration", 6.75, 2.1, 1.55, 0.9, C.sky);
  node(s, "Worker", "Document / intelligence pass", 4.8, 3.55, 1.55, 0.9, C.amber);
  node(s, "Cache", "Saved local docs", 6.75, 3.55, 1.55, 0.9, C.lime);
  node(s, "Primary DB", "Missions, tasks, logs, decisions", 9.1, 2.1, 1.7, 0.9, C.lime);
  node(s, "Object Store", "Exports and artifacts", 11.05, 2.1, 1.7, 0.9, C.sky);
  node(s, "OpenAI API", "Optional enrichment", 9.1, 3.65, 1.7, 0.9, C.amber);
  node(s, "Observability", "Logs, risks, audit trail", 11.05, 3.65, 1.7, 0.9, C.rose);
  arrow(s, 1.95, 3.2, 2.35, 3.2, C.cyan);
  arrow(s, 3.95, 3.2, 4.45, 3.2, C.sky);
  arrow(s, 8.65, 3.0, 9.1, 2.55, C.lime);
  arrow(s, 8.65, 3.5, 9.1, 4.1, C.amber);
  arrow(s, 10.8, 2.55, 11.05, 2.55, C.sky);
  arrow(s, 10.8, 4.1, 11.05, 4.1, C.rose);
  text(s, "Designed for demo reliability now, production migration later: local JSON/SQLite to Postgres/Supabase, background jobs, org/user scoping.", 0.8, 6.35, 11.7, 0.42, { size: 12.8, color: C.muted, align: "center" });
}

// 7. Demo
{
  const s = pptx.addSlide();
  addBg(s, "Live demo script: the judge sees the system think");
  const steps = [
    ["1", "Create mission", "Pick a live sample: MCP + Antigravity, Hiring Tracker, Incident War Room"],
    ["2", "Run intelligence pass", "Tasks move queued to running to completed; logs and artifacts appear"],
    ["3", "Inspect diagrams", "Product flow, traceability, cloud architecture and deployment lanes"],
    ["4", "Export documents", "PRD, Technical Design, Engineering Plan, AI Execution Pack"],
    ["5", "Reuse memory", "Duplicate mission and preserve execution knowledge patterns"]
  ];
  steps.forEach(([n, title, body], i) => {
    const x = 0.75 + (i % 3) * 4.15;
    const y = i < 3 ? 1.6 : 4.05;
    card(s, x, y, 3.55, 1.45, { fill: "081421", line: [C.cyan, C.sky, C.lime, C.amber, C.violet][i], lineT: 30 });
    slideNum(s, n, x + 0.18, y + 0.2, [C.cyan, C.sky, C.lime, C.amber, C.violet][i]);
    text(s, title, x + 0.75, y + 0.24, 2.55, 0.25, { size: 13.5, bold: true });
    text(s, body, x + 0.75, y + 0.65, 2.55, 0.48, { size: 9.5, color: C.muted });
  });
}

function slideNum(s, n, x, y, color) {
  s.addShape(pptx.ShapeType.ellipse, { x, y, w: 0.42, h: 0.42, fill: { color }, line: { color } });
  text(s, n, x, y + 0.1, 0.42, 0.1, { size: 9, bold: true, color: C.bg, align: "center" });
}

// 8. Evaluation alignment
{
  const s = pptx.addSlide();
  addBg(s, "Hackathon evaluation alignment");
  text(s, "The skill file lists the Codex sponsor direction and prize context, but no formal judging-criteria fields. We align to the stated event thesis: move past chat, orchestrate agents, maximize Codex leverage, and create AI-native UX.", 0.75, 1.36, 11.8, 0.56, { size: 13.5, color: C.muted, align: "center" });
  const rows = [
    ["Innovation", "Execution OS, not another chat/code generator", C.cyan],
    ["Product Thinking", "Clear user, problem, workflow, memory and handoff model", C.lime],
    ["Visual Impact", "Command center, cloud diagrams, traceability maps, animations", C.sky],
    ["Technical Sophistication", "Next.js, APIs, local persistence, cached docs, fallback generation", C.amber],
    ["Demo Quality", "Live samples, stepper, stop control, document exports", C.violet],
    ["Memorability", "Judges can say: I saw AI software execution visualized", C.rose]
  ];
  rows.forEach(([label, proof, color], i) => {
    const x = 0.8 + (i % 2) * 6.0;
    const y = 2.25 + Math.floor(i / 2) * 1.25;
    card(s, x, y, 5.45, 0.95, { fill: "081421", line: color, lineT: 35 });
    text(s, label, x + 0.25, y + 0.18, 1.9, 0.22, { size: 12.5, bold: true, color });
    text(s, proof, x + 2.25, y + 0.16, 2.85, 0.34, { size: 9.6, color: C.muted });
  });
}

// 9. Roadmap
{
  const s = pptx.addSlide();
  addBg(s, "Roadmap: from hackathon MVP to execution knowledge base");
  const phases = [
    ["Now", "Mission planning, intelligence pass, document studio, caching, diagrams"],
    ["Next", "Fork/compare missions, reusable architecture templates, richer decision logs"],
    ["Later", "Org workspaces, MCP surface, external project-management sync, evaluation agents"]
  ];
  phases.forEach(([phase, desc], i) => {
    const x = 1.0 + i * 4.05;
    card(s, x, 2.15, 3.45, 2.65, { fill: "081421", line: [C.cyan, C.lime, C.amber][i], lineT: 28 });
    pill(s, phase, x + 0.25, 2.45, 1.0, [C.cyan, C.lime, C.amber][i]);
    text(s, desc, x + 0.25, 3.08, 2.9, 0.9, { size: 14, color: C.white, bold: true });
  });
  text(s, "The long-term product is an organizational memory layer for agentic software execution.", 1.2, 6.25, 10.9, 0.38, { size: 15.5, bold: true, color: C.cyan, align: "center" });
}

// 10. Closing
{
  const s = pptx.addSlide();
  addBg(s, "");
  text(s, "Codex Mission Control", 0.75, 1.15, 8.5, 0.6, { fontFace: "Aptos Display", size: 38, bold: true });
  text(s, "Eliminating the gap between thinking about software and executing software.", 0.78, 2.0, 8.7, 0.42, { size: 18, color: C.cyan, bold: true });
  bullet(s, [
    "System of record between idea and execution",
    "Production-ready documentation from mission intelligence",
    "Traceable goals, requirements, tasks, architecture and risks",
    "Reusable AI execution context for Codex and future agent workflows"
  ], 0.85, 3.0, 6.4, { h: 1.7, size: 15 });
  card(s, 8.25, 1.3, 3.8, 4.8, { fill: "081421", line: C.lime, lineT: 35 });
  text(s, "Submission angle", 8.65, 1.75, 3.0, 0.3, { size: 16, bold: true, color: C.lime, align: "center" });
  text(s, "Not a code generator.\nNot another chat UI.\n\nAn AI-native execution control plane that makes software work visible, explainable, and reusable.", 8.65, 2.55, 3.0, 1.9, { size: 17, color: C.white, bold: true, align: "center" });
  pill(s, "Built with Codex", 9.28, 5.15, 1.9, C.cyan);
}

pptx.writeFile({ fileName: path.resolve(__dirname, "../output/codex-mission-control-hackathon-pitch.pptx") });
