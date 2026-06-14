import Link from "next/link";
import Image from "next/image";
import { Activity, AlertTriangle, BarChart3, CheckCircle2, FileText, Network, Rocket, Sparkles, XCircle } from "lucide-react";
import { listMissions } from "@/lib/store";
import { StatusPill } from "@/components/status-pill";
import { formatTimestamp } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const missions = await listMissions();
  const completed = missions.filter((mission) => mission.status === "completed").length;
  const running = missions.filter((mission) => mission.status === "running").length;
  const failed = missions.filter((mission) => mission.status === "failed").length;
  const canceled = missions.filter((mission) => mission.status === "canceled").length;
  const documentsReady = missions.filter((mission) => mission.summary).length * 4;
  const totalTasks = missions.reduce((sum, mission) => sum + mission.tasks.length, 0);
  const completedTasks = missions.reduce(
    (sum, mission) => sum + mission.tasks.filter((task) => task.status === "completed").length,
    0
  );
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const riskSignals = missions.reduce((sum, mission) => sum + (mission.summary?.risks.length ?? 0), 0);
  const analytics = [
    { label: "Missions Run", value: missions.length, detail: `${running} live now`, icon: Rocket, tone: "from-cyan-300/20 to-cyan-300/5 text-cyan-100" },
    { label: "Execution Rate", value: `${completionRate}%`, detail: `${completedTasks}/${totalTasks || 0} tasks complete`, icon: Activity, tone: "from-lime-300/20 to-lime-300/5 text-lime-100" },
    { label: "Docs Ready", value: documentsReady, detail: "PRD, TDD, plan, AI pack", icon: FileText, tone: "from-sky-300/20 to-sky-300/5 text-sky-100" },
    { label: "Risk Signals", value: riskSignals, detail: "captured for handoff", icon: AlertTriangle, tone: "from-amber-300/20 to-amber-300/5 text-amber-100" }
  ];

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur md:p-12">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(142,240,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(142,240,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="relative grid gap-10 md:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
              <Sparkles size={14} />
              <span className="ml-2">Codex Mission Control</span>
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
                The control plane between idea and execution.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-300">
                An AI Software Execution Operating System that turns raw ideas into PRDs, technical designs,
                engineering plans, AI execution packs, decision logs, traceability maps, and reusable mission memory.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/mission/new"
                className="inline-flex items-center rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Create mission
              </Link>
              <div className="inline-flex items-center rounded-full border border-white/10 px-5 py-3 text-sm text-zinc-300">
                Documentation-first execution intelligence
              </div>
            </div>
          </div>

          <section className="rounded-[2rem] border border-white/10 bg-black/25 p-6">
            <div className="relative mx-auto mb-6 flex aspect-square max-w-sm items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-200/[0.04]">
              <Image
                src="/mission-control-orbit.svg"
                alt="Mission Control orbit visualization"
                fill
                sizes="320px"
                className="absolute inset-8 rounded-[2rem] opacity-20"
              />
              <div className="absolute h-3/4 w-3/4 animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-cyan-200/20" />
              <div className="absolute h-1/2 w-1/2 animate-[spin_12s_linear_infinite_reverse] rounded-full border border-dashed border-lime-200/20" />
              <div className="grid h-32 w-32 place-items-center rounded-[2rem] border border-white/10 bg-slate-950/80 text-center shadow-[0_0_80px_rgba(142,240,255,0.16)]">
                <Network className="mx-auto text-cyan-200" size={30} />
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-300">Mission OS</p>
              </div>
              <div className="absolute left-6 top-10 rounded-full bg-cyan-200 px-3 py-1 text-xs font-semibold text-slate-950">PRD</div>
              <div className="absolute right-4 top-24 rounded-full bg-lime-200 px-3 py-1 text-xs font-semibold text-slate-950">TDD</div>
              <div className="absolute bottom-14 left-8 rounded-full bg-sky-200 px-3 py-1 text-xs font-semibold text-slate-950">Plan</div>
              <div className="absolute bottom-7 right-10 rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-slate-950">Risks</div>
            </div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Why judges remember it</p>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-zinc-300">
              <p>Every mission becomes a living system of record.</p>
              <p>Every output is explainable, exportable, and traceable.</p>
              <p>Every plan can be reused by humans or external AI tools.</p>
            </div>
          </section>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {analytics.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.label} className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${item.tone} p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                    <Icon size={22} />
                  </div>
                  <BarChart3 className="text-white/20" size={38} />
                </div>
                <p className="mt-5 text-sm uppercase tracking-[0.18em] text-white/55">{item.label}</p>
                <p className="mt-2 text-4xl font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-sm text-zinc-300">{item.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <CheckCircle2 className="text-lime-200" />
            <p className="mt-4 text-2xl font-semibold text-white">{completed}</p>
            <p className="text-sm text-zinc-400">Completed missions</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <XCircle className="text-rose-200" />
            <p className="mt-4 text-2xl font-semibold text-white">{failed + canceled}</p>
            <p className="text-sm text-zinc-400">Stopped or failed missions</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <Network className="text-cyan-200" />
            <p className="mt-4 text-2xl font-semibold text-white">{missions.filter((mission) => mission.summary).length}</p>
            <p className="text-sm text-zinc-400">Reusable knowledge packs</p>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Mission runs</h2>
              <p className="text-sm text-zinc-400">Persisted locally so we can keep iterating run by run.</p>
            </div>
          </div>

          {missions.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-10 text-zinc-400">
              No missions yet. Create the first mission and the system will generate a live execution plan.
            </div>
          ) : (
            <div className="grid gap-4">
              {missions.map((mission) => (
                <Link
                  key={mission.id}
                  href={`/mission/${mission.id}`}
                  className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition hover:border-cyan-200/30 hover:bg-white/[0.06] md:grid-cols-[1fr_auto]"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">{mission.title}</h3>
                      <StatusPill status={mission.status} />
                    </div>
                    <p className="max-w-3xl text-sm leading-7 text-zinc-300">{mission.objective}</p>
                  </div>
                  <div className="text-sm text-zinc-400 md:text-right">
                    <p>{mission.tasks.length} tasks</p>
                    <p>{formatTimestamp(mission.updatedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
