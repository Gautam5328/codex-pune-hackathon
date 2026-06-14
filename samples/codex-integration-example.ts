type MissionDocumentKind = "prd" | "technical-design" | "engineering-plan" | "ai-execution-pack";

type MissionDocument = {
  kind: MissionDocumentKind;
  title: string;
  body: string;
  generatedAt: string;
};

type Mission = {
  id: string;
  title: string;
  objective: string;
  repositoryContext: string;
  constraints: string;
  documents?: Partial<Record<MissionDocumentKind, MissionDocument>>;
};

export async function runCodexStyleExecution(mission: Mission) {
  const aiPack = mission.documents?.["ai-execution-pack"];

  if (!aiPack) {
    throw new Error("AI Execution Pack is required before execution.");
  }

  const payload = {
    missionId: mission.id,
    title: mission.title,
    objective: mission.objective,
    repositoryContext: mission.repositoryContext,
    constraints: mission.constraints,
    executionContext: aiPack.body
  };

  // Example: hand the mission context to a Codex-style client, MCP tool, or another agent runner.
  console.log("Sending execution context to Codex:");
  console.log(JSON.stringify(payload, null, 2));

  return payload;
}

// Example usage:
// await runCodexStyleExecution(mission);
