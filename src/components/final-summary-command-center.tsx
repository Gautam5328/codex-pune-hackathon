import { AlertTriangle, CheckCircle2, Database, Files, ListChecks, Route, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { deriveMissionSummary } from "@/lib/mission-derived";
import { Mission } from "@/lib/types";

function SummaryAccordion({
  title,
  eyebrow,
  children,
  defaultOpen = false
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">{eyebrow}</p>
          <h3 className="mt-1 text-base font-semibold text-white">{title}</h3>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-lg text-zinc-300 transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="mt-4 text-sm leading-7 text-zinc-300">{children}</div>
    </details>
  );
}

export function FinalSummaryCommandCenter({ mission }: { mission: Mission }) {
  if (!mission.summary) {
    return (
      <section className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.04] p-6 text-sm leading-7 text-zinc-400">
        Run the mission to generate executive summary, risks, architecture, database, and handoff guidance.
      </section>
    );
  }

  const summary = deriveMissionSummary(mission);
  const analytics = [
    { label: "Risks", value: summary.risks.length, icon: AlertTriangle, tone: "text-amber-200" },
    { label: "Next Steps", value: summary.nextSteps.length, icon: ListChecks, tone: "text-cyan-200" },
    { label: "Stack Items", value: (summary.techStack ?? []).length, icon: Sparkles, tone: "text-lime-200" },
    { label: "Tables", value: (summary.tables ?? []).length, icon: Database, tone: "text-sky-200" }
  ];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">Final Summary</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Mission intelligence cockpit</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
            A compact command-center view of what was learned, what is risky, and what should happen next.
          </p>
        </div>
        <div className="rounded-full border border-lime-200/20 bg-lime-200/10 px-4 py-2 text-sm font-semibold text-lime-100">
          Ready for handoff
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {analytics.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
              <Icon className={item.tone} size={20} />
              <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-cyan-200/15 bg-cyan-200/[0.04] p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 text-cyan-200" size={20} />
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">Outcome</p>
            <p className="mt-2 text-sm leading-7 text-zinc-200">{summary.outcome}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <SummaryAccordion title="Risks and mitigations" eyebrow="Risk Radar" defaultOpen>
          <ul className="space-y-2">
            {summary.risks.map((risk) => (
              <li key={risk} className="flex gap-3">
                <AlertTriangle className="mt-1 shrink-0 text-amber-200" size={16} />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </SummaryAccordion>

        <SummaryAccordion title="Recommended next steps" eyebrow="Execution Path">
          <ul className="space-y-2">
            {summary.nextSteps.map((step) => (
              <li key={step} className="flex gap-3">
                <Route className="mt-1 shrink-0 text-cyan-200" size={16} />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </SummaryAccordion>

        <SummaryAccordion title="Technical foundation" eyebrow="Architecture">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Tech stack</p>
              <ul className="mt-3 space-y-2">
                {(summary.techStack ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Database</p>
              <p className="mt-3">{summary.database ?? "Database recommendation will appear after a V2 mission summary is generated."}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-zinc-500">Tables</p>
              <ul className="mt-3 space-y-2">
                {(summary.tables ?? []).map((table) => (
                  <li key={table}>{table}</li>
                ))}
              </ul>
            </div>
          </div>
        </SummaryAccordion>

        <SummaryAccordion title="Suggested file structure" eyebrow="Project Shape">
          <ul className="space-y-2 font-mono text-xs">
            {(summary.fileStructure ?? []).map((item) => (
              <li key={item} className="flex gap-3">
                <Files className="mt-1 shrink-0 text-sky-200" size={14} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SummaryAccordion>

        <SummaryAccordion title="Best practices and handoff path" eyebrow="Operating Model">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Best practices</p>
              <ul className="mt-3 space-y-2">
                {(summary.bestPractices ?? []).map((practice) => (
                  <li key={practice} className="flex gap-3">
                    <ShieldCheck className="mt-1 shrink-0 text-lime-200" size={15} />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">How to use this context</p>
              <ul className="mt-3 space-y-2">
                {(summary.executionContextPath ?? summary.codeGenerationPath ?? []).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </SummaryAccordion>
      </div>
    </section>
  );
}
