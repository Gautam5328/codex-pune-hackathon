import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Mission } from "@/lib/types";

const dataDirectory = path.join(process.cwd(), "data");
const missionFile = path.join(dataDirectory, "missions.json");

async function ensureStore() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(missionFile, "utf8");
  } catch {
    await writeFile(missionFile, "[]", "utf8");
  }
}

async function readMissions() {
  await ensureStore();
  const raw = await readFile(missionFile, "utf8");
  return JSON.parse(raw) as Mission[];
}

async function writeMissions(missions: Mission[]) {
  await ensureStore();
  await writeFile(missionFile, JSON.stringify(missions, null, 2), "utf8");
}

export async function listMissions() {
  return readMissions();
}

export async function getMission(id: string) {
  const missions = await readMissions();
  return missions.find((mission) => mission.id === id) ?? null;
}

export async function saveMission(mission: Mission) {
  const missions = await readMissions();
  const index = missions.findIndex((item) => item.id === mission.id);

  if (index >= 0) {
    missions[index] = mission;
  } else {
    missions.unshift(mission);
  }

  await writeMissions(missions);
  return mission;
}

