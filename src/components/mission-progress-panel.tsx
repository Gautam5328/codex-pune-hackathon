import { TaskStatus } from "@/lib/types";

function stepTone(status: TaskStatus) {
  if (status === "completed") {
    return "border-lime-300/30 bg-lime-300/10 text-lime-50";
  }

  if (status === "in_progress") {
    return "border-cyan-300/30 bg-cyan-300/10 text-cyan-50";
  }

  if (status === "blocked") {
    return "border-rose-300/30 bg-rose-300/10 text-rose-50";
  }

  return "border-white/10 bg-white/[0.03] text-zinc-300";
}

export function MissionProgressPanel({
  status,
  tasks
}: {
  status: "planned" | "running" | "completed" | "failed" | "draft" | "canceled";
  tasks: Array<{ id: string; title: string; status: TaskStatus }>;
}) {
  if (status === "planned" || status === "draft") {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Execution Stepper</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {status === "running"
              ? "Mission Control is actively progressing through the mission tasks below."
              : status === "canceled"
                ? "The mission was stopped. Completed steps remain as the execution trace and queued steps show what was left."
                : "The mission run has finished. Completed steps remain as a visible execution trace."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {tasks.map((task, index) => (
          <div key={task.id} className={`flex items-center gap-4 rounded-[1.4rem] border px-4 py-4 ${stepTone(task.status)}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-current/30 text-sm font-semibold">
              {task.status === "completed" ? "✓" : index + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium">{task.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] opacity-80">
                {task.status === "in_progress"
                  ? "Executing now"
                  : task.status === "completed"
                    ? "Completed"
                    : task.status === "blocked"
                      ? "Blocked"
                      : "Queued"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
