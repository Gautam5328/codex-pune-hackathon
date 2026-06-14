import { NextResponse } from "next/server";
import { startMissionRun } from "@/lib/mission-runner";
import { getMission, saveMission } from "@/lib/store";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const mission = await getMission(id);

    if (!mission) {
      return NextResponse.json({ error: "Mission not found." }, { status: 404 });
    }

    if (mission.status === "running") {
      return NextResponse.json({ mission });
    }

    const runningMission = {
      ...mission,
      status: "running" as const,
      updatedAt: new Date().toISOString(),
      tasks: mission.tasks.map((task, index) =>
        index === 0 ? { ...task, status: "in_progress" as const } : task
      ),
      logs: [
        ...mission.logs,
        {
          id: `log_start_${Date.now()}`,
          level: "info" as const,
          message: "Mission execution started.",
          timestamp: new Date().toISOString()
        }
      ]
    };

    await saveMission(runningMission);
    await startMissionRun(id);

    return NextResponse.json({ mission: runningMission }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start mission execution.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
