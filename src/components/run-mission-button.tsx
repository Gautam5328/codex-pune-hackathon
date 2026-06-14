"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function RunMissionButton({ missionId, disabled }: { missionId: string; disabled: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isRunning, setIsRunning] = useState(false);

  async function handleRun() {
    setError("");
    setIsRunning(true);

    try {
      const response = await fetch(`/api/missions/${missionId}/start`, {
        method: "POST"
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to execute mission.");
        setIsRunning(false);
        return;
      }

      setIsRunning(false);
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Failed to execute mission.");
      setIsRunning(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={disabled || isPending || isRunning}
        onClick={handleRun}
        className="inline-flex items-center rounded-full bg-lime-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending || isRunning ? "Starting mission..." : "Run mission"}
      </button>
      {isRunning ? (
        <p className="text-sm text-zinc-400">
          Mission started. The page will refresh automatically as tasks move from queued to running to completed.
        </p>
      ) : null}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
