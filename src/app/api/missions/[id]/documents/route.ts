import { NextResponse } from "next/server";
import { z } from "zod";
import { generateFallbackMissionDocument } from "@/lib/mission-derived";
import { generateMissionDocument } from "@/lib/openai";
import { getMission, saveMission } from "@/lib/store";
import { MissionDocumentKind } from "@/lib/types";

const documentRequestSchema = z.object({
  kind: z.enum(["prd", "technical-design", "engineering-plan", "ai-execution-pack"]),
  refresh: z.boolean().optional().default(false)
});

const documentTitles: Record<MissionDocumentKind, string> = {
  prd: "Product Requirements Document",
  "technical-design": "Technical Design Document",
  "engineering-plan": "Engineering Execution Plan",
  "ai-execution-pack": "AI Execution Pack"
};

function withTimeout<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Document generation timed out.")), milliseconds);
    })
  ]);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const mission = await getMission(id);

    if (!mission) {
      return NextResponse.json({ error: "Mission not found." }, { status: 404 });
    }

    const body = await request.json();
    const { kind, refresh } = documentRequestSchema.parse(body);
    const cachedDocument = mission.documents?.[kind];

    if (cachedDocument && !refresh) {
      return NextResponse.json({ document: cachedDocument, cached: true });
    }

    let bodyMarkdown = "";

    try {
      bodyMarkdown = await withTimeout(generateMissionDocument(mission, kind), 12000);
    } catch (error) {
      console.error("Document generation failed, using deterministic fallback.", error);
      bodyMarkdown = generateFallbackMissionDocument(mission, kind);
    }

    const document = {
      kind,
      title: documentTitles[kind],
      body: bodyMarkdown,
      generatedAt: new Date().toISOString()
    };

    await saveMission({
      ...mission,
      documents: {
        ...(mission.documents ?? {}),
        [kind]: document
      },
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ document, cached: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate document.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
