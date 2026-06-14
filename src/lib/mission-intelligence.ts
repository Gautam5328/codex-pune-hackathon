import { DecisionRecord, KnowledgeEdge, KnowledgeNode, Mission } from "@/lib/types";

export function buildKnowledgeGraph(mission: Mission) {
  const nodes: KnowledgeNode[] = [
    { id: "goal", label: mission.objective, type: "goal" }
  ];

  const edges: KnowledgeEdge[] = [];

  mission.tasks.forEach((task, index) => {
    const taskId = `task-${index}`;
    const requirementId = `requirement-${index}`;

    nodes.push({
      id: requirementId,
      label: task.title,
      type: "requirement"
    });

    nodes.push({
      id: taskId,
      label: task.title,
      type: "task"
    });

    edges.push({ from: "goal", to: requirementId, label: "drives" });
    edges.push({ from: requirementId, to: taskId, label: "satisfied by" });

    task.dependsOn.forEach((dependencyId) => {
      const dependencyIndex = mission.tasks.findIndex((candidate) => candidate.id === dependencyId);

      if (dependencyIndex >= 0) {
        edges.push({ from: `task-${dependencyIndex}`, to: taskId, label: "unblocks" });
      }
    });
  });

  (mission.summary?.techStack ?? []).slice(0, 4).forEach((item, index) => {
    const architectureId = `architecture-${index}`;
    nodes.push({ id: architectureId, label: item, type: "architecture" });
    edges.push({ from: "goal", to: architectureId, label: "implemented through" });
  });

  (mission.summary?.risks ?? []).slice(0, 4).forEach((risk, index) => {
    const riskId = `risk-${index}`;
    nodes.push({ id: riskId, label: risk, type: "risk" });
    edges.push({ from: riskId, to: "goal", label: "threatens" });
  });

  return { nodes, edges };
}

export function buildDecisionLog(mission: Mission): DecisionRecord[] {
  const decisions: DecisionRecord[] = [];

  (mission.summary?.techStack ?? []).slice(0, 5).forEach((item) => {
    decisions.push({
      decision: `Use ${item}`,
      reason: "Selected because it appears in the mission architecture or implementation summary.",
      tradeoffs: "Keeps the plan coherent, but may need validation against team skills, cost, and deployment constraints.",
      alternatives: "Comparable frameworks, managed services, or lower-level custom implementation."
    });
  });

  if (mission.summary?.database) {
    decisions.push({
      decision: `Use ${mission.summary.database}`,
      reason: "The mission requires a persistence model for reusable execution knowledge and structured planning outputs.",
      tradeoffs: "Adds schema discipline and traceability, but increases setup and migration responsibility.",
      alternatives: "Local JSON, SQLite, Supabase, PostgreSQL, or document storage depending on scale."
    });
  }

  if (decisions.length === 0) {
    decisions.push({
      decision: "Use Mission Control as the documentation system of record",
      reason: "The mission needs traceable planning artifacts before execution moves into external tools.",
      tradeoffs: "Improves clarity and handoff quality, but requires users to maintain mission context.",
      alternatives: "Unstructured chat logs, standalone docs, tickets, or ad hoc planning notes."
    });
  }

  return decisions;
}
