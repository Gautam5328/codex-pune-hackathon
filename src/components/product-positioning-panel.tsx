export function ProductPositioningPanel() {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-2xl font-semibold text-white">AI Software Execution Operating System</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">Primary users</p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            Founders, product leads, architects, delivery teams, and AI-native engineering teams that need a system of record between idea and execution.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">Problem solved</p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            It transforms mission intelligence into PRDs, technical designs, engineering plans, AI execution packs, architecture maps, risk models, and traceable workflows.
          </p>
        </div>
      </div>
    </section>
  );
}
