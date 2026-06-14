"use client";

import { useEffect, useState } from "react";

type LoadingOverlayProps = {
  title: string;
  description: string;
  steps?: string[];
  stepDurationMs?: number;
};

export function LoadingOverlay({
  title,
  description,
  steps = [],
  stepDurationMs = 6500
}: LoadingOverlayProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (steps.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    }, stepDurationMs);

    return () => window.clearInterval(interval);
  }, [stepDurationMs, steps.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm">
      <div className="mx-6 max-w-xl rounded-[1.75rem] border border-cyan-200/20 bg-slate-950/90 p-6 shadow-2xl shadow-cyan-950/20">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-200/20 border-t-cyan-300" />
        <h3 className="mt-5 text-center text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-center text-sm leading-7 text-zinc-300">{description}</p>

        {steps.length > 0 ? (
          <div className="mt-6 space-y-3">
            {steps.map((step, index) => {
              const isCompleted = index < activeStep;
              const isCurrent = index === activeStep;

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                    isCurrent
                      ? "border-cyan-200/30 bg-cyan-200/10 text-cyan-50"
                      : isCompleted
                        ? "border-lime-200/20 bg-lime-200/10 text-lime-50"
                        : "border-white/10 bg-white/5 text-zinc-400"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
                      isCurrent
                        ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                        : isCompleted
                          ? "border-lime-300 bg-lime-300/15 text-lime-100"
                          : "border-white/10 bg-black/20 text-zinc-500"
                    }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{step}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em]">
                      {isCompleted ? "Completed" : isCurrent ? "In progress" : "Pending"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
