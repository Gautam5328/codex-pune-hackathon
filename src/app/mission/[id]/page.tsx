import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ChevronDown, Clock3, FileBox, ScrollText } from "lucide-react";
import { FinalSummaryCommandCenter } from "@/components/final-summary-command-center";
import { MissionAutoRefresh } from "@/components/mission-auto-refresh";
import { MissionDecisionLog } from "@/components/mission-decision-log";
import { MissionDiagrams } from "@/components/mission-diagrams";
import { MissionDocumentStudio } from "@/components/mission-document-studio";
import { MissionKnowledgeGraph } from "@/components/mission-knowledge-graph";
import { MissionMemoryPanel } from "@/components/mission-memory-panel";
import { MissionProgressPanel } from "@/components/mission-progress-panel";
import { ProductPositioningPanel } from "@/components/product-positioning-panel";
import { RunMissionButton } from "@/components/run-mission-button";
import { StatusPill } from "@/components/status-pill";
import { StopMissionButton } from "@/components/stop-mission-button";
import { getMission } from "@/lib/store";
import { formatTimestamp } from "@/lib/utils";

function AccordionShell({
  title,
  eyebrow,
  count,
  icon,
  children,
  defaultOpen = false
}: {
  title: string;
  eyebrow: string;
  count?: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/25 text-cyan-200">
            {icon}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">{eyebrow}</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {count ? <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-400">{count}</span> : null}
          <ChevronDown className="text-zinc-400 transition group-open:rotate-180" size={20} />
        </div>
      </summary>
      <div className="mt-5">{children}</div>
    </details>
  );
}

export default async function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mission = await getMission(id);

  if (!mission) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <MissionAutoRefresh missionId={mission.id} status={mission.status} />
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-sm text-zinc-400 transition hover:text-white">
            Back to dashboard
          </Link>
          <div className="flex flex-wrap items-start gap-3">
            <RunMissionButton missionId={mission.id} disabled={mission.status === "completed" || mission.status === "running"} />
            {mission.status === "running" ? <StopMissionButton missionId={mission.id} disabled={false} /> : null}
          </div>
        </div>

        <section className="grid gap-6 rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={mission.status} />
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Mission Run</p>
              </div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl">{mission.title}</h1>
              <p className="max-w-4xl text-lg leading-8 text-zinc-300">{mission.objective}</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5 text-sm text-zinc-300">
              <p>Created: {formatTimestamp(mission.createdAt)}</p>
              <p>Updated: {formatTimestamp(mission.updatedAt)}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">Repository Context</p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                {mission.repositoryContext || "No repository context provided."}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">Constraints</p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                {mission.constraints || "No additional constraints provided."}
              </p>
            </div>
          </div>
        </section>

        <MissionProgressPanel status={mission.status} tasks={mission.tasks} />
        <ProductPositioningPanel />
        <MissionDiagrams mission={mission} />
        <MissionDocumentStudio missionId={mission.id} initialDocuments={mission.documents} />
        <MissionKnowledgeGraph mission={mission} />
        <MissionDecisionLog mission={mission} />
        <MissionMemoryPanel missionId={mission.id} />

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6">
            <AccordionShell title="Task Timeline" eyebrow="Mission Steps" count={`${mission.tasks.length} tasks`} icon={<Clock3 size={20} />} defaultOpen>
              <div className="space-y-4">
                {mission.tasks.map((task, index) => (
                  <details key={task.id} className="group rounded-[1.5rem] border border-white/10 bg-black/20 p-5" open={index === 0}>
                    <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Task {index + 1}</p>
                        <h3 className="mt-2 text-lg font-semibold text-white">{task.title}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusPill status={task.status} />
                        <ChevronDown className="text-zinc-500 transition group-open:rotate-180" size={18} />
                      </div>
                    </summary>
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <p className="text-sm leading-7 text-zinc-300">{task.description}</p>
                      <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-zinc-400">
                        <span>Owner: {task.owner}</span>
                        <span>Dependencies: {task.dependsOn.length}</span>
                      </div>
                      {task.output ? (
                        <div className="mt-4 rounded-[1.25rem] border border-cyan-200/10 bg-cyan-200/[0.03] p-4 text-sm leading-7 text-zinc-200">
                          {task.output}
                        </div>
                      ) : null}
                    </div>
                  </details>
                ))}
              </div>
            </AccordionShell>

            <AccordionShell title="Execution Log" eyebrow="Audit Trail" count={`${mission.logs.length} logs`} icon={<ScrollText size={20} />}>
              <div className="mt-5 space-y-3">
                {mission.logs.map((log) => (
                  <div key={log.id} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium text-white">{log.message}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{log.level}</p>
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">{formatTimestamp(log.timestamp)}</p>
                  </div>
                ))}
              </div>
            </AccordionShell>
          </div>

          <div className="grid gap-6">
            <AccordionShell title="Artifacts" eyebrow="Mission Outputs" count={`${mission.artifacts.length} artifacts`} icon={<FileBox size={20} />}>
              <div className="mt-5 space-y-4">
                {mission.artifacts.map((artifact) => (
                  <details key={artifact.id} className="group rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-white">{artifact.title}</h3>
                      <div className="flex items-center gap-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{artifact.type}</p>
                        <ChevronDown className="text-zinc-500 transition group-open:rotate-180" size={18} />
                      </div>
                    </summary>
                    <p className="mt-4 whitespace-pre-wrap border-t border-white/10 pt-4 text-sm leading-7 text-zinc-300">{artifact.body}</p>
                  </details>
                ))}
              </div>
            </AccordionShell>

            <FinalSummaryCommandCenter mission={mission} />
          </div>
        </section>
      </div>
    </main>
  );
}
