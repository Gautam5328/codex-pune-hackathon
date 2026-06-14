import { Mission, MissionDocumentKind, Summary } from "@/lib/types";

const defaultStack = [
  "Next.js App Router",
  "TypeScript",
  "Tailwind CSS",
  "Route Handlers",
  "Prisma ORM",
  "SQLite for MVP persistence",
  "OpenAI API for AI summaries and document intelligence",
  "Zod for request validation"
];

const defaultFileStructure = [
  "src/app/(dashboard)/pipeline/page.tsx",
  "src/app/candidates/[id]/page.tsx",
  "src/app/api/candidates/route.ts",
  "src/app/api/candidates/[id]/move/route.ts",
  "src/app/api/candidates/[id]/ai-summary/route.ts",
  "src/lib/services/pipeline-service.ts",
  "src/lib/services/alerting-service.ts",
  "src/lib/services/ai-summary-service.ts",
  "prisma/schema.prisma",
  "prisma/seed.ts"
];

const defaultTables = [
  "stages",
  "candidates",
  "interviews",
  "scorecards",
  "notes",
  "ai_summaries",
  "alerts"
];

const defaultBestPractices = [
  "Keep AI provider calls behind server-side route handlers.",
  "Use deterministic mock responses for demos when API keys are missing.",
  "Validate all mutation endpoints with zod.",
  "Track stageEnteredAt separately from updatedAt for accurate bottleneck alerts.",
  "Keep domain logic in services so UI and API routes stay thin."
];

const defaultExecutionContextPath = [
  "Use the PRD to align product scope and target users.",
  "Use the technical design to implement architecture and data flow.",
  "Use the engineering plan to create sprint tickets.",
  "Use the AI execution pack as context for Codex or another execution tool.",
  "Use risks and decision log as review gates before implementation."
];

function missionLooksLikeHiringTracker(mission: Mission) {
  const text = `${mission.title} ${mission.objective}`.toLowerCase();
  return text.includes("hiring") || text.includes("recruit") || text.includes("candidate") || text.includes("pipeline");
}

export function deriveMissionSummary(mission: Mission): Summary {
  const isHiringTracker = missionLooksLikeHiringTracker(mission);
  const summary = mission.summary;

  return {
    outcome:
      summary?.outcome ??
      `Mission intelligence package prepared for ${mission.title}. Use the generated documents and traceability map before execution.`,
    risks:
      summary?.risks?.length
        ? summary.risks
        : [
            "Scope can expand quickly if integrations, auth, or real-time collaboration are added too early.",
            "Demo quality depends on seeded data and deterministic empty/loading states.",
            "AI features need graceful fallback when provider latency or configuration fails."
          ],
    nextSteps:
      summary?.nextSteps?.length
        ? summary.nextSteps
        : [
            "Confirm MVP scope and demo storyline.",
            "Validate architecture and data model.",
            "Turn engineering plan into tickets.",
            "Use the AI execution pack as external-tool context."
          ],
    techStack:
      summary?.techStack?.length
        ? summary.techStack
        : isHiringTracker
          ? defaultStack
          : ["Next.js App Router", "TypeScript", "Tailwind CSS", "Route Handlers", "OpenAI API", "Local JSON or SQLite persistence"],
    fileStructure:
      summary?.fileStructure?.length
        ? summary.fileStructure
        : isHiringTracker
          ? defaultFileStructure
          : [
              "src/app/page.tsx",
              "src/app/api/missions/route.ts",
              "src/components/mission-dashboard.tsx",
              "src/lib/services/mission-service.ts",
              "src/lib/openai.ts",
              "data/missions.json"
            ],
    database:
      summary?.database ??
      (isHiringTracker ? "SQLite via Prisma for the MVP; PostgreSQL/Supabase when multi-user collaboration is added." : "Local JSON for prototype, SQLite/PostgreSQL for production knowledge storage."),
    tables: summary?.tables?.length ? summary.tables : isHiringTracker ? defaultTables : ["missions", "tasks", "artifacts", "decisions", "risks"],
    bestPractices: summary?.bestPractices?.length ? summary.bestPractices : defaultBestPractices,
    executionContextPath:
      summary?.executionContextPath?.length
        ? summary.executionContextPath
        : summary?.codeGenerationPath?.length
          ? summary.codeGenerationPath
          : defaultExecutionContextPath
  };
}

function list(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function generateFallbackMissionDocument(mission: Mission, kind: MissionDocumentKind) {
  const summary = deriveMissionSummary(mission);
  const tasks = mission.tasks.map((task, index) => `${index + 1}. ${task.title}: ${task.description}`).join("\n");

  if (kind === "prd") {
    return `# Product Requirements Document: ${mission.title}

## Product Vision
${mission.objective}

## Problem Statement
Teams lose execution context between idea, architecture, planning, and handoff. This mission turns the idea into a shared system of record.

## Target Users
- Founders validating an MVP
- Product managers preparing requirements
- Engineering leads preparing implementation plans
- AI-native teams handing context to Codex or other tools

## User Personas
- Product Lead: needs a crisp PRD and success criteria.
- Engineering Lead: needs architecture, risks, and task sequencing.
- Builder: needs enough context to execute without re-asking basic questions.

## User Stories
${list(mission.tasks.map((task) => `As a team member, I need ${task.title.toLowerCase()} so that ${task.description}`))}

## Functional Requirements
${tasks}

## Non Functional Requirements
${list(["Reliable loading and error states", "Server-side secret handling", "Clear audit trail", "Reusable mission context"])}

## Success Metrics
${list(["Mission can be understood in under 2 minutes", "PRD/TDD/plan/AI pack can be exported", "Risks and dependencies are visible", "Next execution steps are obvious"])}

## Risks
${list(summary.risks)}

## Assumptions
${list(["MVP scope is prioritized over integrations", "Seeded/demo data is acceptable for hackathon validation", "Execution happens in external tools after context is prepared"])}

## Future Scope
${list(["Team collaboration", "Mission comparison", "Reusable architecture templates", "Deeper integrations with project management tools"])}`;
  }

  if (kind === "technical-design") {
    return `# Technical Design Document: ${mission.title}

## System Overview
The system converts mission context into structured execution intelligence: tasks, artifacts, risks, decisions, diagrams, and exportable documents.

## Architecture Decisions
${list(summary.techStack.map((item) => `Use ${item} because it supports fast MVP execution and clear handoff.`))}

## Component Breakdown
${list(["Dashboard analytics", "Mission detail command center", "Document Studio", "Traceability Map", "Decision Log", "Mission Memory"])}

## Data Flow
Idea -> Mission plan -> Task execution trace -> Artifacts/risks/summary -> Documents/diagrams/AI execution pack.

## APIs
${list(["POST /api/missions", "POST /api/missions/:id/start", "POST /api/missions/:id/stop", "POST /api/missions/:id/documents", "POST /api/missions/:id/duplicate"])}

## Integrations
${list(["OpenAI API for planning and document intelligence", "Local persistence for hackathon reliability"])}

## Database Design
Recommended database: ${summary.database}

Tables:
${list(summary.tables)}

## Security Considerations
${list(["Keep API keys in .env.local only", "Do not expose provider errors in the UI", "Validate request payloads", "Preserve execution logs for auditability"])}

## Scalability Considerations
${list(["Move local persistence to PostgreSQL/Supabase", "Cache generated documents", "Add background jobs for long-running generation", "Add org/user scoping"])}

## Deployment Strategy
Deploy as a Next.js app with server-side environment variables and persistent storage configured per environment.`;
  }

  if (kind === "engineering-plan") {
    return `# Engineering Execution Plan: ${mission.title}

## Epics
${list(["Mission intake and planning", "Execution intelligence dashboard", "Document Studio", "Traceability and decision system", "Mission memory"])}

## Features
${list(["Create mission", "Run/stop execution", "Generate PRD/TDD/engineering plan/AI pack", "View diagrams", "Duplicate mission"])}

## Stories
${list(mission.tasks.map((task) => `As an execution lead, I can review ${task.title.toLowerCase()} so the mission can move forward with clarity.`))}

## Tasks
${tasks}

## Dependencies
${list(mission.tasks.flatMap((task) => task.dependsOn.length ? [`${task.title} depends on ${task.dependsOn.length} prior task(s).`] : []))}

## Risks
${list(summary.risks)}

## Estimates
${list(["MVP polish: 4-6 hours", "Document generation hardening: 2-3 hours", "Diagram and analytics pass: 3-4 hours", "Demo rehearsal and bug fixes: 1-2 hours"])}`;
  }

  return `# AI Execution Pack: ${mission.title}

## Product Context
${mission.objective}

## Architecture Context
${list(summary.techStack)}

## Technical Constraints
${mission.constraints || "No explicit constraints were provided. Preserve MVP scope, fast demo reliability, and server-side API safety."}

## Acceptance Criteria
${list(["Documents generate successfully or fallback gracefully", "Diagrams explain architecture and execution flow", "Long content is collapsed into accordions", "Mission summary has analytics and handoff guidance"])}

## Feature Breakdown
${tasks}

## Recommended Task Order
${list(summary.executionContextPath)}

## Risks
${list(summary.risks)}

## Edge Cases
${list(["Missing OpenAI key", "Older missions without V2 summary fields", "Long model latency", "Empty task/artifact collections", "User stops execution midway"])}`;
}
