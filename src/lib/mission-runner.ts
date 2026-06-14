import { executeMissionTask, summarizeMission } from "@/lib/openai";
import { getMission, saveMission } from "@/lib/store";
import { Artifact, LogEntry, Mission } from "@/lib/types";

const activeRuns = new Map<string, Promise<void>>();

function createLog(message: string, level: LogEntry["level"] = "info"): LogEntry {
  return {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    level,
    message,
    timestamp: new Date().toISOString()
  };
}

async function updateMission(id: string, updater: (mission: Mission) => Mission | Promise<Mission>) {
  const mission = await getMission(id);

  if (!mission) {
    throw new Error("Mission not found.");
  }

  const updated = await updater(mission);
  await saveMission(updated);
  return updated;
}

async function runMission(id: string) {
  const collectedRisks: string[] = [];
  const collectedNextSteps: string[] = [];

  try {
    for (let index = 0; ; index += 1) {
      const mission = await getMission(id);

      if (!mission) {
        return;
      }

      if (mission.status === "canceled") {
        return;
      }

      if (index >= mission.tasks.length) {
        break;
      }

      await updateMission(id, (current) => ({
        ...current,
        status: "running",
        updatedAt: new Date().toISOString(),
        tasks: current.tasks.map((task, taskIndex) =>
          taskIndex === index
            ? { ...task, status: "in_progress" }
            : task
        ),
        logs: [
          ...current.logs,
          createLog(`Starting task ${index + 1}: ${current.tasks[index].title}`)
        ]
      }));

      const currentMission = await getMission(id);

      if (!currentMission) {
        return;
      }

      if (currentMission.status === "canceled") {
        return;
      }

      const task = currentMission.tasks[index];
      const taskResult = await executeMissionTask(currentMission, task, index);

      collectedRisks.push(...taskResult.risks);
      collectedNextSteps.push(...taskResult.nextSteps);

      await updateMission(id, (current) => ({
        ...current,
        status: "running",
        updatedAt: new Date().toISOString(),
        tasks: current.tasks.map((currentTask, taskIndex) => {
          if (taskIndex === index) {
            return {
              ...currentTask,
              status: "completed",
              output: taskResult.output
            };
          }

          return currentTask;
        }),
        artifacts: [...current.artifacts, ...taskResult.artifacts],
        logs: [
          ...current.logs,
          ...taskResult.logs,
          createLog(`Completed task ${index + 1}: ${current.tasks[index].title}`, "success")
        ]
      }));
    }

    const mission = await getMission(id);

    if (!mission) {
      return;
    }

    if (mission.status === "canceled") {
      return;
    }

    const summary = await summarizeMission(mission, collectedRisks, collectedNextSteps);

    await updateMission(id, (current) => ({
      ...current,
      status: "completed",
      updatedAt: new Date().toISOString(),
      summary,
      logs: [...current.logs, createLog("Mission completed successfully.", "success")]
    }));
  } catch (error) {
    await updateMission(id, (current) => ({
      ...current,
      status: "failed",
      updatedAt: new Date().toISOString(),
      logs: [
        ...current.logs,
        createLog(error instanceof Error ? error.message : "Mission execution failed.", "error")
      ]
    }));
  }
}

export async function startMissionRun(id: string) {
  if (activeRuns.has(id)) {
    return false;
  }

  const run = runMission(id).finally(() => {
    activeRuns.delete(id);
  });

  activeRuns.set(id, run);
  return true;
}
