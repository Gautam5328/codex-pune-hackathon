import { NextResponse } from "next/server";
import { getMission } from "@/lib/store";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const mission = await getMission(id);

  if (!mission) {
    return NextResponse.json({ error: "Mission not found." }, { status: 404 });
  }

  return NextResponse.json({ mission });
}

