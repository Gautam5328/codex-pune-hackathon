import { buildKnowledgeGraph } from "@/lib/mission-intelligence";
import { Mission } from "@/lib/types";

const nodeTone = {
  goal: "border-cyan-200/30 bg-cyan-200/10 text-cyan-50",
  requirement: "border-emerald-200/30 bg-emerald-200/10 text-emerald-50",
  task: "border-sky-200/30 bg-sky-200/10 text-sky-50",
  architecture: "border-amber-200/30 bg-amber-200/10 text-amber-50",
  risk: "border-rose-200/30 bg-rose-200/10 text-rose-50",
  dependency: "border-zinc-200/20 bg-zinc-200/10 text-zinc-50"
};

export function MissionKnowledgeGraph({ mission }: { mission: Mission }) {
  const graph = buildKnowledgeGraph(mission);
  const tracePaths = graph.edges
    .map((edge) => {
      const from = graph.nodes.find((node) => node.id === edge.from);
      const to = graph.nodes.find((node) => node.id === edge.to);

      return {
        id: `${edge.from}-${edge.to}-${edge.label}`,
        from: from?.label ?? edge.from,
        to: to?.label ?? edge.to,
        label: edge.label
      };
    })
    .slice(0, 10);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">Traceability Map</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Why every task exists</h2>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400">
        This replaces vague “AI said so” planning. Each path shows which goal, requirement, task, architecture choice, or risk explains the work.
      </p>
      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
          {graph.nodes.slice(0, 14).map((node) => (
            <div key={node.id} className={`rounded-xl border p-3 ${nodeTone[node.type]}`}>
              <p className="text-xs uppercase tracking-[0.16em] opacity-70">{node.type}</p>
              <p className="mt-1 line-clamp-2 text-sm font-medium">{node.label}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-semibold text-white">Trace paths</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Kept because traceability is the product moat; renamed from relationships for clarity.</p>
          <div className="mt-4 grid gap-3">
            {tracePaths.map((path) => (
              <div key={path.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-300 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <span className="line-clamp-2 text-zinc-100">{path.from}</span>
                <span className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-center text-xs uppercase tracking-[0.14em] text-cyan-100">
                  {path.label}
                </span>
                <span className="line-clamp-2 text-zinc-100">{path.to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
