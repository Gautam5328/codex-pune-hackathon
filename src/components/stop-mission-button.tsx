"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function StopMissionButton({ missionId, disabled }: { missionId: string; disabled: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleStop() {
    setError("");

    try {
      const response = await fetch(`/api/missions/${missionId}/stop`, {
        method: "POST"
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to stop mission.");
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Failed to stop mission.");
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled || isPending}
        onClick={handleStop}
        className="inline-flex items-center rounded-full border border-rose-300/30 bg-rose-300/10 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Stopping..." : "Stop execution"}
      </button>
      <p className="text-xs text-zinc-500">
        Stop takes effect after the current task finishes. In-flight model calls are not interrupted yet.
      </p>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
