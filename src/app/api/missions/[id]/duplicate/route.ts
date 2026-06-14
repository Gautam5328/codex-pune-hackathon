import { NextResponse } from "next/server";
import { getMission, saveMission } from "@/lib/store";
import { Mission } from "@/lib/types";
import { createId } from "@/lib/utils";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const mission = await getMission(id);

  if (!mission) {
    return NextResponse.json({ error: "Mission not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const duplicated: Mission = {
    ...mission,
    id: createId("mission"),
    title: `${mission.title} (Duplicate)`,
    status: "planned",
    createdAt: now,
    updatedAt: now,
    tasks: mission.tasks.map((task) => ({
      ...task,
      id: createId("task"),
      status: "queued",
      output: ""
    })),
    logs: [
      {
        id: createId("log"),
        level: "info",
        message: `Duplicated from ${mission.title}.`,
        timestamp: now
      }
    ],
    documents: undefined,
    summary: undefined
  };

  await saveMission(duplicated);

  return NextResponse.json({ mission: duplicated });
}
