import { MissionStatus, TaskStatus } from "@/lib/types";

const statusStyles: Record<MissionStatus | TaskStatus, string> = {
  draft: "bg-zinc-500/20 text-zinc-200",
  planned: "bg-sky-500/20 text-sky-200",
  running: "bg-amber-500/20 text-amber-200",
  completed: "bg-lime-500/20 text-lime-200",
  failed: "bg-rose-500/20 text-rose-200",
  canceled: "bg-orange-500/20 text-orange-200",
  queued: "bg-zinc-500/20 text-zinc-200",
  in_progress: "bg-amber-500/20 text-amber-200",
  blocked: "bg-rose-500/20 text-rose-200"
};

export function StatusPill({ status }: { status: MissionStatus | TaskStatus }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusStyles[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}
