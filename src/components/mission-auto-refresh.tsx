"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function MissionAutoRefresh({
  missionId,
  status
}: {
  missionId: string;
  status: "planned" | "running" | "completed" | "failed" | "draft" | "canceled";
}) {
  const router = useRouter();

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/missions/${missionId}`);
        const data = await response.json();

        if (data.mission?.status && data.mission.status !== "running") {
          window.clearInterval(interval);
        }

        router.refresh();
      } catch {
        router.refresh();
      }
    }, 2500);

    return () => window.clearInterval(interval);
  }, [missionId, router, status]);

  return null;
}
