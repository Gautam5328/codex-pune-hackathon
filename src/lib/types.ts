export type MissionStatus = "draft" | "planned" | "running" | "completed" | "failed" | "canceled";
export type TaskStatus = "queued" | "in_progress" | "completed" | "blocked";
export type ArtifactType = "plan" | "analysis" | "execution" | "review" | "summary";
export type MissionDocumentKind = "prd" | "technical-design" | "engineering-plan" | "ai-execution-pack";

export interface Task {
  id: string;
  title: string;
  description: string;
  owner: "planner" | "builder" | "reviewer" | "reporter";
  status: TaskStatus;
  dependsOn: string[];
  output?: string;
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  body: string;
  createdAt: string;
}

export interface LogEntry {
  id: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: string;
}

export interface Summary {
  outcome: string;
  risks: string[];
  nextSteps: string[];
  techStack: string[];
  fileStructure: string[];
  database: string;
  tables: string[];
  bestPractices: string[];
  executionContextPath: string[];
  codeGenerationPath?: string[];
}

export interface MissionDocument {
  kind: MissionDocumentKind;
  title: string;
  body: string;
  generatedAt: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: "goal" | "requirement" | "task" | "architecture" | "risk" | "dependency";
}

export interface KnowledgeEdge {
  from: string;
  to: string;
  label: string;
}

export interface DecisionRecord {
  decision: string;
  reason: string;
  tradeoffs: string;
  alternatives: string;
}

export interface Mission {
  id: string;
  title: string;
  objective: string;
  repositoryContext: string;
  constraints: string;
  status: MissionStatus;
  tasks: Task[];
  artifacts: Artifact[];
  logs: LogEntry[];
  documents?: Partial<Record<MissionDocumentKind, MissionDocument>>;
  summary?: Summary;
  createdAt: string;
  updatedAt: string;
}
