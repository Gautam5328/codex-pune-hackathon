"use client";

import { ChevronDown, Download, FileText, LoaderCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { MissionDocument, MissionDocumentKind } from "@/lib/types";

const documentOptions: Array<{
  kind: MissionDocumentKind;
  label: string;
  description: string;
}> = [
  {
    kind: "prd",
    label: "Mission to PRD",
    description: "Executive-ready product requirements."
  },
  {
    kind: "technical-design",
    label: "Technical Design",
    description: "Engineer-ready architecture and implementation design."
  },
  {
    kind: "engineering-plan",
    label: "Engineering Plan",
    description: "Sprint-ready epics, stories, tasks, dependencies, and estimates."
  },
  {
    kind: "ai-execution-pack",
    label: "AI Execution Pack",
    description: "Context package for external AI tools without losing mission memory."
  }
];

function downloadMarkdown(document: MissionDocument) {
  const blob = new Blob([document.body], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = `${document.kind}-${document.generatedAt.slice(0, 10)}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

export function MissionDocumentStudio({
  missionId,
  initialDocuments = {}
}: {
  missionId: string;
  initialDocuments?: Partial<Record<MissionDocumentKind, MissionDocument>>;
}) {
  const initialKind = (Object.keys(initialDocuments)[0] as MissionDocumentKind | undefined) ?? "prd";
  const [activeKind, setActiveKind] = useState<MissionDocumentKind>(initialKind);
  const [documents, setDocuments] = useState<Partial<Record<MissionDocumentKind, MissionDocument>>>(initialDocuments);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCached, setIsCached] = useState(Boolean(initialDocuments[initialKind]));
  const [error, setError] = useState("");
  const document = documents[activeKind] ?? null;

  async function generateDocument(kind: MissionDocumentKind, refresh = false) {
    setActiveKind(kind);
    setError("");

    if (documents[kind] && !refresh) {
      setIsCached(true);
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`/api/missions/${missionId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, refresh })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to generate document.");
        return;
      }

      setDocuments((current) => ({
        ...current,
        [kind]: data.document
      }));
      setIsCached(Boolean(data.cached));
    } catch {
      setError("Unable to generate document.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">Mission Document Studio</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Export mission intelligence</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-300">
            Turn the mission into production-ready documents for executives, engineers, delivery teams, and external AI execution tools.
          </p>
        </div>
        {document ? (
          <button
            type="button"
            onClick={() => downloadMarkdown(document)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:border-cyan-200/30"
          >
            <Download size={16} />
            Download Markdown
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {documentOptions.map((option) => (
          <button
            key={option.kind}
            type="button"
            onClick={() => generateDocument(option.kind)}
            className={`rounded-xl border p-4 text-left transition ${
              activeKind === option.kind
                ? "border-cyan-200/40 bg-cyan-200/10"
                : "border-white/10 bg-black/20 hover:border-white/20"
            }`}
          >
            <FileText className="mb-3 text-cyan-200" size={18} />
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white">{option.label}</p>
              {documents[option.kind] ? (
                <span className="rounded-full bg-lime-200/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-lime-100">
                  Saved
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-xs leading-5 text-zinc-400">{option.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/25 p-5">
        {isGenerating ? (
          <div className="flex items-center gap-3 text-sm text-zinc-300">
            <LoaderCircle className="animate-spin text-cyan-200" size={18} />
            <span>Generating {documentOptions.find((option) => option.kind === activeKind)?.label}...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-rose-300">{error}</p>
        ) : document ? (
          <details open className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{document.title}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {isCached ? "Loaded from local mission memory" : "Generated and saved locally"} · {new Date(document.generatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    generateDocument(activeKind, true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-cyan-200/30"
                >
                  <RefreshCw size={13} />
                  Regenerate
                </button>
                <ChevronDown className="text-zinc-400 transition group-open:rotate-180" size={18} />
              </div>
            </summary>
            <pre className="mt-4 max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-200">{document.body}</pre>
          </details>
        ) : (
          <p className="text-sm text-zinc-400">Choose a document type to generate an export-ready artifact.</p>
        )}
      </div>
    </section>
  );
}
