import { NextResponse } from "next/server";
import { getMission, saveMission } from "@/lib/store";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const mission = await getMission(id);

  if (!mission) {
    return NextResponse.json({ error: "Mission not found." }, { status: 404 });
  }

  if (mission.status !== "running") {
    return NextResponse.json({ mission });
  }

  const updatedMission = {
    ...mission,
    status: "canceled" as const,
    updatedAt: new Date().toISOString(),
    logs: [
      ...mission.logs,
      {
        id: `log_stop_${Date.now()}`,
        level: "warning" as const,
        message: "Mission stop requested. The run will halt after the current task finishes.",
        timestamp: new Date().toISOString()
      }
    ]
  };

  await saveMission(updatedMission);

  return NextResponse.json({ mission: updatedMission });
}
