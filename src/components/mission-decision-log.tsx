import { ChevronDown, GitCompareArrows, Scale } from "lucide-react";
import { buildDecisionLog } from "@/lib/mission-intelligence";
import { Mission } from "@/lib/types";

export function MissionDecisionLog({ mission }: { mission: Mission }) {
  const decisions = buildDecisionLog(mission);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">Mission Decision Log</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Explain the important choices</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {decisions.map((decision) => (
          <details key={decision.decision} className="group rounded-xl border border-white/10 bg-black/20 p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-white">{decision.decision}</h3>
              <ChevronDown className="shrink-0 text-zinc-500 transition group-open:rotate-180" size={18} />
            </summary>
            <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-zinc-300">{decision.reason}</p>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                  <Scale size={14} />
                  Tradeoffs
                </p>
                <p className="mt-1 leading-6 text-zinc-300">{decision.tradeoffs}</p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                  <GitCompareArrows size={14} />
                  Alternatives
                </p>
                <p className="mt-1 leading-6 text-zinc-300">{decision.alternatives}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
