import OpenAI from "openai";
import { z } from "zod";
import { createId } from "@/lib/utils";
import { Artifact, LogEntry, Mission, MissionDocumentKind, Summary, Task } from "@/lib/types";

const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
  owner: z.string(),
  dependsOn: z.array(z.number()).default([])
});

const planSchema = z.object({
  missionTitle: z.string(),
  tasks: z.array(taskSchema).min(4),
  planNarrative: z.string()
});

const executionSchema = z.object({
  output: z.string(),
  logs: z.array(
    z.object({
      level: z.enum(["info", "success", "warning", "error"]),
      message: z.string()
    })
  ),
  artifacts: z.array(
    z.object({
      type: z.enum(["analysis", "execution", "review", "summary"]),
      title: z.string(),
      body: z.string()
    })
  ),
  risks: z.array(z.string()),
  nextSteps: z.array(z.string())
});

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  return new OpenAI({ apiKey });
}

function normalizeOwner(owner: string): Task["owner"] {
  const value = owner.toLowerCase();

  if (value.includes("plan") || value.includes("lead") || value.includes("product")) {
    return "planner";
  }

  if (value.includes("review") || value.includes("qa")) {
    return "reviewer";
  }

  if (value.includes("report") || value.includes("release") || value.includes("writer")) {
    return "reporter";
  }

  return "builder";
}

async function repairJsonOutput(client: OpenAI, model: string, rawOutput: string, repairInstructions: string) {
  const repairResponse = await client.responses.create({
    model,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You repair structured outputs. Return valid JSON only, with no markdown fences or explanation."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              "Transform the following content into JSON that exactly matches the required shape.",
              repairInstructions,
              "If any field is missing, infer a concise but plausible value from the existing content.",
              "Raw content:",
              rawOutput
            ].join("\n")
          }
        ]
      }
    ]
  });

  return repairResponse.output_text;
}

async function requestJson<T>(prompt: string, schema: z.ZodSchema<T>, repairInstructions: string) {
  const client = getClient();
  const model = process.env.OPENAI_MODEL ?? "gpt-5.2";

  const response = await client.responses.create({
    model,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are a senior engineering operations agent. Always return valid JSON only, with no markdown fences and no commentary outside the JSON."
          }
        ]
      },
      {
        role: "user",
        content: [{ type: "input_text", text: prompt }]
      }
    ]
  });

  try {
    return schema.parse(JSON.parse(response.output_text));
  } catch {
    const repairedOutput = await repairJsonOutput(client, model, response.output_text, repairInstructions);
    return schema.parse(JSON.parse(repairedOutput));
  }
}

export async function generateMissionPlan(input: {
  objective: string;
  repositoryContext: string;
  constraints: string;
}) {
  const result = await requestJson(
    [
      "Create an execution plan for a coding mission.",
      "Return JSON with missionTitle, tasks, and planNarrative.",
      "Each task must have title, description, owner, and dependsOn as indexes referencing earlier tasks.",
      "The mission is for Codex Mission Control, so the plan must feel practical and execution-oriented.",
      `Objective: ${input.objective}`,
      `Repository context: ${input.repositoryContext || "No repo context provided."}`,
      `Constraints: ${input.constraints || "No additional constraints."}`
    ].join("\n"),
    planSchema,
    [
      "Required JSON shape:",
      '{ "missionTitle": string, "planNarrative": string, "tasks": [{ "title": string, "description": string, "owner": string, "dependsOn": number[] }] }',
      "Return between 4 and 8 tasks.",
      "dependsOn must only reference earlier task indexes."
    ].join("\n")
  );

  const createdAt = new Date().toISOString();
  const normalizedTasks = result.tasks.slice(0, 8);

  const tasks: Task[] = normalizedTasks.map((task) => ({
    id: createId("task"),
    title: task.title,
    description: task.description,
    owner: normalizeOwner(task.owner),
    status: "queued",
    dependsOn: (task.dependsOn ?? []).map((dependencyIndex) => `task-index-${dependencyIndex}`),
    output: ""
  }));

  const dependencyLookup = tasks.map((task) => task.id);
  tasks.forEach((task) => {
    task.dependsOn = task.dependsOn
      .map((dependency) => {
        const index = Number(dependency.replace("task-index-", ""));
        return dependencyLookup[index];
      })
      .filter(Boolean);
  });

  const planArtifact: Artifact = {
    id: createId("artifact"),
    type: "plan",
    title: "Mission Plan",
    body: result.planNarrative,
    createdAt
  };

  const planningLog: LogEntry = {
    id: createId("log"),
    level: "success",
    message: "Mission plan generated successfully.",
    timestamp: createdAt
  };

  return {
    title: result.missionTitle,
    tasks,
    artifacts: [planArtifact],
    logs: [planningLog]
  };
}

export async function executeMissionTask(mission: Mission, task: Task, index: number) {
  const execution = await requestJson(
    [
      "Execute one mission task conceptually and return only JSON.",
      "You are not editing files directly. Instead, produce the output, artifacts, logs, risks, and next steps that a mission-control layer should show for this single task.",
      "The output should be concise, concrete, and implementation-oriented.",
      `Mission title: ${mission.title}`,
      `Objective: ${mission.objective}`,
      `Repository context: ${mission.repositoryContext || "No repo context provided."}`,
      `Constraints: ${mission.constraints || "No additional constraints."}`,
      `Current task index: ${index}`,
      `Current task: ${JSON.stringify({
        title: task.title,
        description: task.description,
        owner: task.owner
      })}`,
      `Completed tasks so far: ${JSON.stringify(
        mission.tasks
          .map((existingTask, existingIndex) => ({
            index: existingIndex,
            title: existingTask.title,
            status: existingTask.status,
            output: existingTask.output ?? ""
          }))
          .filter((existingTask) => existingTask.status === "completed")
      )}`
    ].join("\n"),
    executionSchema,
    [
      "Required JSON shape:",
      '{ "output": string, "logs": [{ "level": "info" | "success" | "warning" | "error", "message": string }], "artifacts": [{ "type": "analysis" | "execution" | "review" | "summary", "title": string, "body": string }], "risks": string[], "nextSteps": string[] }',
      "Keep outputs concise and practical."
    ].join("\n")
  );

  const now = new Date().toISOString();
  const executionArtifacts: Artifact[] = execution.artifacts.map((artifact) => ({
    id: createId("artifact"),
    type: artifact.type,
    title: artifact.title,
    body: artifact.body,
    createdAt: now
  }));

  const logs: LogEntry[] = execution.logs.map((entry) => ({
    id: createId("log"),
    level: entry.level,
    message: entry.message,
    timestamp: now
  }));

  return {
    output: execution.output,
    artifacts: executionArtifacts,
    logs,
    risks: execution.risks,
    nextSteps: execution.nextSteps
  };
}

export async function summarizeMission(mission: Mission, risks: string[], nextSteps: string[]) {
  return requestJson(
    [
      "Create a final mission summary for a completed mission.",
      "Return only JSON.",
      `Mission title: ${mission.title}`,
      `Objective: ${mission.objective}`,
      `Completed tasks: ${JSON.stringify(
        mission.tasks.map((task, index) => ({
          index,
          title: task.title,
          output: task.output ?? ""
        }))
      )}`,
      `Artifacts: ${JSON.stringify(
        mission.artifacts.slice(-8).map((artifact) => ({
          title: artifact.title,
          type: artifact.type
        }))
      )}`,
      `Candidate risks: ${JSON.stringify(risks)}`,
      `Candidate next steps: ${JSON.stringify(nextSteps)}`
    ].join("\n"),
    z.object({
      outcome: z.string(),
      risks: z.array(z.string()),
      nextSteps: z.array(z.string()),
      techStack: z.array(z.string()),
      fileStructure: z.array(z.string()),
      database: z.string(),
      tables: z.array(z.string()),
      bestPractices: z.array(z.string()),
      executionContextPath: z.array(z.string())
    }),
    [
      "Required JSON shape:",
      '{ "outcome": string, "risks": string[], "nextSteps": string[], "techStack": string[], "fileStructure": string[], "database": string, "tables": string[], "bestPractices": string[], "executionContextPath": string[] }',
      "Summarize the mission succinctly and deduplicate repeated risks or next steps.",
      "Make this directly useful for documentation handoff and external AI execution context.",
      "Do not frame this as code generation or file generation."
    ].join("\n")
  );
}

function documentInstructions(kind: MissionDocumentKind) {
  const shared = [
    "Write in clean Markdown.",
    "Do not include code generation instructions.",
    "Do not claim files were generated.",
    "Use concise sections, tables where useful, and executive/engineering clarity.",
    "Ground every section in the mission context, tasks, artifacts, risks, and summary."
  ];

  if (kind === "prd") {
    return [
      "Generate a complete Product Requirements Document.",
      "Include: Product Vision, Problem Statement, Target Users, User Personas, User Stories, Functional Requirements, Non Functional Requirements, Success Metrics, Risks, Assumptions, Future Scope.",
      "Output should be executive-ready.",
      ...shared
    ].join("\n");
  }

  if (kind === "technical-design") {
    return [
      "Generate a technical implementation document.",
      "Include: System Overview, Architecture Decisions, Component Breakdown, Data Flow, APIs, Integrations, Database Design, Security Considerations, Scalability Considerations, Deployment Strategy.",
      "Output should be engineer-ready.",
      ...shared
    ].join("\n");
  }

  if (kind === "engineering-plan") {
    return [
      "Generate a sprint-ready engineering execution plan.",
      "Include: Epics, Features, Stories, Tasks, Dependencies, Risks, Estimates.",
      "Output should be team-ready.",
      ...shared
    ].join("\n");
  }

  return [
    "Generate an AI-ready implementation context package.",
    "Purpose: allow execution in external tools without losing context.",
    "Include: Product Context, Architecture Context, Technical Constraints, Acceptance Criteria, Feature Breakdown, Recommended Task Order, Risks, Edge Cases.",
    "This is context generation, not code generation.",
    ...shared
  ].join("\n");
}

export async function generateMissionDocument(mission: Mission, kind: MissionDocumentKind) {
  const client = getClient();
  const model = process.env.OPENAI_MODEL ?? "gpt-5.2";

  const response = await client.responses.create({
    model,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are a senior product, architecture, and engineering documentation lead. Return only the requested Markdown document."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              documentInstructions(kind),
              `Mission: ${mission.title}`,
              `Objective: ${mission.objective}`,
              `Repository context: ${mission.repositoryContext}`,
              `Constraints: ${mission.constraints}`,
              `Tasks: ${JSON.stringify(mission.tasks)}`,
              `Artifacts: ${JSON.stringify(mission.artifacts)}`,
              `Summary: ${JSON.stringify(mission.summary ?? null)}`
            ].join("\n\n")
          }
        ]
      }
    ]
  });

  return response.output_text;
}
