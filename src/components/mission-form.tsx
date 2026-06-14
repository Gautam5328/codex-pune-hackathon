"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LoadingOverlay } from "@/components/loading-overlay";

const presets = [
  {
    label: "MCP + Antigravity",
    objective:
      "Create an MCP server and integrate it with Antigravity so AI coding agents can inspect project context, retrieve PRDs and technical designs, trigger mission workflows, and preserve execution memory across sessions.",
    repositoryContext:
      "Greenfield Next.js control plane with a TypeScript MCP server, local mission persistence, OpenAI-powered document intelligence, and clear setup instructions for Antigravity-compatible MCP clients.",
    constraints:
      "Do not generate app code for users. Focus on MCP tool design, secure API-key handling, traceable mission documents, cached document outputs, and a polished demo flow."
  },
  {
    label: "Hiring Pipeline Tracker",
    objective:
      "Build a hiring pipeline tracker for recruiting teams with candidate stages, interview scorecards, AI-generated candidate summaries, hiring bottleneck alerts, and recruiter/admin dashboards.",
    repositoryContext:
      "Greenfield Next.js app. Needs polished web UI, route handlers, local persistence first, and clean architecture for future multi-user support.",
    constraints:
      "Keep the MVP hackathon-focused. Prioritize candidate flow, interview feedback capture, AI summaries, and strong demo clarity."
  },
  {
    label: "Product Analytics Cockpit",
    objective:
      "Build a product analytics cockpit that shows activation funnel metrics, retention trends, anomaly alerts, AI-generated insights, and executive summary views for product leaders.",
    repositoryContext:
      "Greenfield Next.js app with API routes, local persistence, chart-friendly architecture, and room for future event ingestion pipelines.",
    constraints:
      "Focus on high-signal product metrics, anomaly detection narratives, and a crisp judge-facing dashboard. Avoid overbuilding data infrastructure."
  },
  {
    label: "Support Ops Command Center",
    objective:
      "Build a customer support operations command center with omnichannel inbox triage, SLA breach prediction, AI ticket summaries, escalation routing, agent workload analytics, and executive health reports.",
    repositoryContext:
      "Greenfield Next.js app with local persistence, API routes, dashboard cards, ticket timelines, document exports, and a future integration path for Zendesk, Slack, and email systems.",
    constraints:
      "Prioritize visual operations clarity, SLA risk detection, and role-specific dashboards. Keep integrations mocked but architecture-ready for production."
  },
  {
    label: "Fintech Risk Radar",
    objective:
      "Build a fintech risk radar for compliance teams that monitors transaction anomalies, KYC review queues, policy exceptions, investigation workflows, and AI-generated risk briefs for auditors.",
    repositoryContext:
      "Greenfield secure dashboard with typed APIs, local seeded data, risk scoring services, audit logs, and exportable compliance documentation.",
    constraints:
      "Treat security and auditability as first-class. Do not process real financial data. Use deterministic demo data and explain model decisions clearly."
  },
  {
    label: "Healthcare Discharge Planner",
    objective:
      "Build a hospital discharge planning cockpit that coordinates patient readiness, follow-up tasks, medication review, insurance blockers, care-team notes, and AI-generated discharge summaries.",
    repositoryContext:
      "Greenfield Next.js healthcare operations prototype with task workflows, timeline views, local persistence, care-team dashboards, and document-generation surfaces.",
    constraints:
      "Use synthetic patient data only. Emphasize workflow coordination, safety checks, privacy posture, and explainable recommendations."
  },
  {
    label: "Incident Response War Room",
    objective:
      "Build an incident response war room that tracks live incidents, affected services, owners, mitigation tasks, timeline events, postmortem notes, and AI-generated executive updates.",
    repositoryContext:
      "Greenfield Next.js app with service maps, incident timelines, local persistence, API routes, status dashboards, and exportable postmortem/documentation packs.",
    constraints:
      "Focus on live operational clarity, timeline accuracy, ownership, and executive communication. Avoid real integrations; make the architecture integration-ready."
  }
];

export function MissionForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    objective: "",
    repositoryContext: "",
    constraints: ""
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to create mission.");
        setIsSubmitting(false);
        return;
      }

      startTransition(() => {
        router.push(`/mission/${data.mission.id}`);
      });
    } catch {
      setError("Failed to create mission.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/25 backdrop-blur">
      {isSubmitting ? (
        <LoadingOverlay
          title="Generating mission plan"
          description="OpenAI is building the task graph, dependencies, and execution narrative. This can take a few seconds for larger prompts."
          steps={[
            "Understanding your mission objective",
            "Decomposing the work into execution tasks",
            "Assigning specialist ownership and dependencies",
            "Preparing the mission detail view"
          ]}
          stepDurationMs={4500}
        />
      ) : null}

      <div className="space-y-3">
        <p className="text-sm font-medium text-zinc-200">Try a live sample</p>
        <div className="flex flex-wrap gap-3">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() =>
                setForm({
                  objective: preset.objective,
                  repositoryContext: preset.repositoryContext,
                  constraints: preset.constraints
                })
              }
              className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-200/20"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-200" htmlFor="objective">
          Mission objective
        </label>
        <textarea
          id="objective"
          required
          minLength={20}
          value={form.objective}
          onChange={(event) => setForm((current) => ({ ...current, objective: event.target.value }))}
          className="min-h-40 w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-base text-white outline-none transition focus:border-cyan-300"
          placeholder="Build a customer support dashboard with an inbox, SLA warnings, AI summaries, and role-based admin controls."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-200" htmlFor="repositoryContext">
            Repository context
          </label>
          <textarea
            id="repositoryContext"
            value={form.repositoryContext}
            onChange={(event) => setForm((current) => ({ ...current, repositoryContext: event.target.value }))}
            className="min-h-32 w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-base text-white outline-none transition focus:border-cyan-300"
            placeholder="Greenfield Next.js app. Needs API routes, clean architecture, and deployment-ready setup."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-200" htmlFor="constraints">
            Constraints
          </label>
          <textarea
            id="constraints"
            value={form.constraints}
            onChange={(event) => setForm((current) => ({ ...current, constraints: event.target.value }))}
            className="min-h-32 w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-base text-white outline-none transition focus:border-cyan-300"
            placeholder="Ship within hackathon time. Keep MVP focused. Prefer local persistence first, then extensible APIs."
          />
        </div>
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending || isSubmitting}
        className="inline-flex items-center rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting || isPending ? "Generating mission plan..." : "Generate mission plan"}
      </button>
    </form>
  );
}
