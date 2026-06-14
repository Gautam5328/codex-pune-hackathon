import Link from "next/link";
import { MissionForm } from "@/components/mission-form";

export default function NewMissionPage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-400 transition hover:text-white">
            Back to dashboard
          </Link>
        </div>

        <section className="grid gap-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">Create Mission</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Feed the system a goal with enough signal to become execution knowledge.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-zinc-300">
              The planner uses your objective, repository context, and constraints to generate traceable requirements,
              tasks, architecture context, risks, and reusable documentation.
            </p>
          </div>

          <MissionForm />
        </section>
      </div>
    </main>
  );
}
