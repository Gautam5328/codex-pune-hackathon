# Codex Mission Control

Codex Mission Control is an **AI Software Execution Operating System**.

It is not a code generator. It is the system of record between idea and execution.

## Project Description

Codex Mission Control turns software intent into structured execution intelligence. A user provides a goal, repository context, and constraints. The system then creates a mission plan, executes an intelligence pass, visualizes traceability, and exports reusable documents such as PRDs, technical designs, engineering plans, and AI execution packs.

The product is designed for founders, product managers, engineering leads, agencies, and hackathon teams that need to move from idea to execution without losing context.

## Installation

```bash
npm install
```

## Run The App

```bash
npm run dev
```

If you want the production-style local preview:

```bash
npm run build
npm run preview
```

The app runs at:

```text
http://127.0.0.1:3000
```

## Architecture Overview

The app uses a local-first Next.js stack:

- `Next.js App Router`
- `TypeScript`
- `Tailwind CSS`
- `Route Handlers` for APIs
- `OpenAI API` for mission planning and document generation
- `Local JSON persistence` for missions, logs, tasks, documents, and summaries

Core flow:

1. The user creates a mission with an objective, repository context, and constraints.
2. The planner generates a task graph and stores the mission locally.
3. Mission execution produces logs, artifacts, risks, and a final summary.
4. Mission Document Studio exports PRD, technical design, engineering plan, and AI execution pack.
5. The dashboard shows live mission analytics and traceability.

## Codex Integration

Codex Mission Control is built to produce execution context for Codex and other AI tools.

The product exports:

- Product Requirements Documents
- Technical Design Documents
- Engineering Plans
- AI Execution Packs

The AI Execution Pack is the preferred handoff format for Codex because it includes:

- Product context
- Architecture context
- Technical constraints
- Acceptance criteria
- Feature breakdown
- Recommended task order
- Risks
- Edge cases

The sample integration file shows how a mission can be consumed programmatically and passed into a Codex-style workflow.

## Features

- Mission command center dashboard
- Mission Document Studio
- Traceability map
- Cloud-style architecture diagrams
- Decision log
- Mission memory
- Stop execution control
- Local document caching
- Reusable execution knowledge

## Sample Files

- [Generated PRD](./samples/generated-prd.md)
- [AI Execution Pack Schema](./samples/ai-execution-pack-schema.md)
- [Codex Integration Example](./samples/codex-integration-example.ts)

## Hackathon Positioning

This project was built for the Codex Community Hackathon Pune. The pitch is simple:

Codex Mission Control eliminates the gap between thinking about software and executing software.

It visualizes execution, documents decisions, and creates reusable mission memory instead of dumping long AI responses.

