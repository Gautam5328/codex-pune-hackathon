import {
  Bot,
  Cloud,
  Cpu,
  Database,
  FileText,
  GitBranch,
  Globe2,
  HardDrive,
  Layers3,
  LockKeyhole,
  LucideIcon,
  Monitor,
  Network,
  Route,
  Server,
  ShieldAlert,
  ShieldCheck,
  Users,
  Workflow
} from "lucide-react";
import { Fragment } from "react";
import { deriveMissionSummary } from "@/lib/mission-derived";
import { Mission } from "@/lib/types";

function DiagramNode({
  label,
  detail,
  icon: Icon,
  tone = "cyan"
}: {
  label: string;
  detail: string;
  icon: LucideIcon;
  tone?: "cyan" | "lime" | "sky" | "amber";
}) {
  const toneClass = {
    cyan: "border-cyan-200/20 bg-cyan-200/[0.05] text-cyan-100",
    lime: "border-lime-200/20 bg-lime-200/[0.05] text-lime-100",
    sky: "border-sky-200/20 bg-sky-200/[0.05] text-sky-100",
    amber: "border-amber-200/20 bg-amber-200/[0.05] text-amber-100"
  }[tone];

  return (
    <div className={`rounded-[1.4rem] border p-4 ${toneClass}`}>
      <Icon size={20} />
      <p className="mt-4 text-sm font-semibold text-white">{label}</p>
      <p className="mt-1 text-xs leading-5 text-zinc-400">{detail}</p>
    </div>
  );
}

function Arrow() {
  return <div className="hidden h-px bg-cyan-200/30 md:block" />;
}

function CloudService({
  label,
  sublabel,
  icon: Icon,
  tone = "cyan"
}: {
  label: string;
  sublabel: string;
  icon: LucideIcon;
  tone?: "cyan" | "lime" | "sky" | "amber" | "rose";
}) {
  const toneClass = {
    cyan: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
    lime: "border-lime-300/30 bg-lime-300/10 text-lime-100",
    sky: "border-sky-300/30 bg-sky-300/10 text-sky-100",
    amber: "border-amber-300/30 bg-amber-300/10 text-amber-100",
    rose: "border-rose-300/30 bg-rose-300/10 text-rose-100"
  }[tone];

  return (
    <div className={`relative rounded-2xl border p-4 text-center shadow-[0_18px_50px_rgba(0,0,0,0.2)] ${toneClass}`}>
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/25">
        <Icon size={24} />
      </div>
      <p className="mt-3 text-sm font-semibold text-white">{label}</p>
      <p className="mt-1 text-[11px] leading-4 text-zinc-400">{sublabel}</p>
    </div>
  );
}

function Connector({ vertical = false }: { vertical?: boolean }) {
  if (vertical) {
    return <div className="mx-auto h-8 w-px bg-cyan-200/35" />;
  }

  return (
    <div className="hidden items-center md:flex">
      <div className="h-px flex-1 bg-cyan-200/35" />
      <div className="h-2 w-2 rotate-45 border-r border-t border-cyan-200/50" />
    </div>
  );
}

export function MissionDiagrams({ mission }: { mission: Mission }) {
  const summary = deriveMissionSummary(mission);
  const primaryStack = summary.techStack.slice(0, 4);
  const isHiring = `${mission.title} ${mission.objective}`.toLowerCase().includes("hiring");
  const productActors = isHiring
    ? [
        { label: "Recruiter", detail: "Moves candidates and reviews pipeline health", icon: Users, tone: "cyan" as const },
        { label: "Candidate Pipeline", detail: "Sourced, screen, onsite, offer, hired/rejected", icon: GitBranch, tone: "sky" as const },
        { label: "Scorecards", detail: "Structured interview feedback and recommendations", icon: FileText, tone: "lime" as const },
        { label: "AI Summary", detail: "Strengths, risks, next step, model metadata", icon: Bot, tone: "amber" as const }
      ]
    : [
        { label: "User", detail: "Submits a software idea and constraints", icon: Users, tone: "cyan" as const },
        { label: "Mission Plan", detail: "Tasks, dependencies, owners, risks", icon: GitBranch, tone: "sky" as const },
        { label: "Document Studio", detail: "PRD, TDD, engineering plan, AI pack", icon: FileText, tone: "lime" as const },
        { label: "Mission Memory", detail: "Reusable organizational knowledge", icon: Bot, tone: "amber" as const }
      ];

  return (
    <section className="grid gap-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <div className="flex items-center gap-3">
          <Workflow className="text-cyan-200" size={24} />
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">Product Flow Diagram</p>
            <h2 className="text-2xl font-semibold text-white">{isHiring ? "Hiring pipeline intelligence flow" : "Idea to execution intelligence"}</h2>
          </div>
        </div>

        <div className="mt-6 grid items-center gap-3 md:grid-cols-[1fr_24px_1fr_24px_1fr_24px_1fr]">
          {productActors.map((step, index) => (
            <Fragment key={step.label}>
              <DiagramNode {...step} />
              {index < productActors.length - 1 ? <Arrow key={`${step.label}-arrow`} /> : null}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center gap-3">
            <Layers3 className="text-lime-200" size={24} />
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-lime-200">Architecture Diagram</p>
              <h2 className="text-2xl font-semibold text-white">System components for this idea</h2>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_42px_1fr_42px_1.25fr] md:items-center">
              <CloudService label="Users" sublabel={isHiring ? "Recruiters + hiring managers" : "Founders + product teams"} icon={Users} tone="cyan" />
              <Connector />
              <CloudService label="Edge" sublabel="Route 53 / CDN / WAF boundary" icon={Globe2} tone="sky" />
              <Connector />
              <div className="rounded-[1.5rem] border border-lime-200/20 bg-lime-200/[0.04] p-4">
                <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-lime-100">Application VPC</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <CloudService label="Web App" sublabel={primaryStack[0] ?? "Next.js App Router"} icon={Monitor} tone="cyan" />
                  <CloudService label="API Server" sublabel={primaryStack[1] ?? "Route handlers + services"} icon={Server} tone="sky" />
                  <CloudService label="Worker" sublabel="Mission/document generation jobs" icon={Cpu} tone="amber" />
                  <CloudService label="Cache" sublabel="Saved docs + fast reloads" icon={HardDrive} tone="lime" />
                </div>
              </div>
            </div>

            <Connector vertical />

            <div className="grid gap-4 md:grid-cols-[1fr_42px_1fr] md:items-start">
              <div className="rounded-[1.5rem] border border-sky-200/20 bg-sky-200/[0.04] p-4">
                <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">Data Plane</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <CloudService label="Primary DB" sublabel={summary.database} icon={Database} tone="lime" />
                  <CloudService label="Object Storage" sublabel="Generated docs, exports, artifacts" icon={HardDrive} tone="sky" />
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {summary.tables.slice(0, 8).map((table) => (
                    <span key={table} className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[11px] text-zinc-300">
                      {table}
                    </span>
                  ))}
                </div>
              </div>
              <Connector />
              <div className="rounded-[1.5rem] border border-amber-200/20 bg-amber-200/[0.04] p-4">
                <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">AI + Operations</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <CloudService label="OpenAI API" sublabel="PRD, TDD, plan, AI pack" icon={Bot} tone="amber" />
                  <CloudService label="Observability" sublabel="Logs, risks, decision trail" icon={Network} tone="rose" />
                  <CloudService label="IAM / Secrets" sublabel="Server-side keys + access control" icon={ShieldCheck} tone="sky" />
                  <CloudService label="Alerts" sublabel="Execution and risk signals" icon={ShieldAlert} tone="rose" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center gap-3">
            <Cloud className="text-sky-200" size={24} />
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-sky-200">Cloud Diagram</p>
              <h2 className="text-2xl font-semibold text-white">Deployment-ready shape</h2>
            </div>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5">
            <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              <span>Channel</span>
              <span>Experience</span>
              <span>Middleware</span>
              <span>Resources</span>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="rounded-2xl bg-cyan-200/10 p-3">
                <CloudService label="Browser" sublabel="User session" icon={Monitor} tone="cyan" />
              </div>
              <div className="rounded-2xl bg-sky-200/10 p-3">
                <CloudService label="Mission UI" sublabel="Dashboard + document studio" icon={Layers3} tone="sky" />
              </div>
              <div className="rounded-2xl bg-amber-200/10 p-3">
                <CloudService label="API Routes" sublabel="Validate + orchestrate" icon={Route} tone="amber" />
              </div>
              <div className="rounded-2xl bg-lime-200/10 p-3">
                <CloudService label="Storage" sublabel="Missions + cached docs" icon={Database} tone="lime" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              <div className="rounded-2xl bg-cyan-200/10 p-3">
                <CloudService label="AI Client" sublabel="Codex / external tools" icon={Bot} tone="cyan" />
              </div>
              <div className="rounded-2xl bg-sky-200/10 p-3">
                <CloudService label="AI Pack" sublabel="Portable execution context" icon={FileText} tone="sky" />
              </div>
              <div className="rounded-2xl bg-amber-200/10 p-3">
                <CloudService label="Doc Engine" sublabel="Timeout + local fallback" icon={Cpu} tone="amber" />
              </div>
              <div className="rounded-2xl bg-lime-200/10 p-3">
                <CloudService label="OpenAI" sublabel="Optional enrichment" icon={Cloud} tone="lime" />
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <LockKeyhole className="text-sky-200" size={18} />
              <p className="mt-3 text-sm font-semibold text-white">Security posture</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">Keep API keys server-side, validate payloads, and preserve audit logs.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <ShieldAlert className="text-amber-200" size={18} />
              <p className="mt-3 text-sm font-semibold text-white">{summary.risks.length} risk signals</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">Risks become visible before execution moves to tools.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
