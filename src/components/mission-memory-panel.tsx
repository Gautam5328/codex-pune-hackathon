"use client";

import { Archive, Repeat2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function MissionMemoryPanel({ missionId }: { missionId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function duplicateMission() {
    setError("");

    try {
      const response = await fetch(`/api/missions/${missionId}/duplicate`, {
        method: "POST"
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to duplicate mission.");
        return;
      }

      startTransition(() => {
        router.push(`/mission/${data.mission.id}`);
      });
    } catch {
      setError("Unable to duplicate mission.");
    }
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">Mission Memory</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Reuse organizational knowledge</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <button
          type="button"
          disabled={isPending}
          onClick={duplicateMission}
          className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-cyan-200/30 disabled:opacity-60"
        >
          <Repeat2 className="mt-1 text-cyan-200" size={18} />
          <span>
            <span className="block text-sm font-semibold text-white">Duplicate Mission</span>
            <span className="mt-1 block text-sm leading-6 text-zinc-400">Reuse this mission as a new planning baseline.</span>
          </span>
        </button>
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-white/10 bg-black/10 p-4 opacity-70">
          <Archive className="mt-1 text-zinc-400" size={18} />
          <span>
            <span className="block text-sm font-semibold text-zinc-200">Compare Missions</span>
            <span className="mt-1 block text-sm leading-6 text-zinc-500">
              Planned capability, not shown as an executable action yet. Current executable memory action is duplicate.
            </span>
          </span>
        </div>
      </div>
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </section>
  );
}
