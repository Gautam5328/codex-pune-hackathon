import { NextResponse } from "next/server";
import { z } from "zod";
import { generateMissionPlan } from "@/lib/openai";
import { saveMission } from "@/lib/store";
import { Mission } from "@/lib/types";
import { createId } from "@/lib/utils";

const missionInputSchema = z.object({
  objective: z.string().min(20),
  repositoryContext: z.string().default(""),
  constraints: z.string().default("")
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = missionInputSchema.parse(body);
    const createdAt = new Date().toISOString();
    const plan = await generateMissionPlan(input);

    const mission: Mission = {
      id: createId("mission"),
      title: plan.title,
      objective: input.objective,
      repositoryContext: input.repositoryContext,
      constraints: input.constraints,
      status: "planned",
      tasks: plan.tasks,
      artifacts: plan.artifacts,
      logs: plan.logs,
      createdAt,
      updatedAt: createdAt
    };

    await saveMission(mission);

    return NextResponse.json({ mission });
  } catch (error) {
    console.error("Mission creation failed:", error);
    const message = error instanceof Error ? error.message : "Unable to create mission.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
