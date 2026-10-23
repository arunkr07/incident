import { AnimatePresence, motion } from "framer-motion";
import {
  BrainCircuit,
  ChevronLeft,
  Clock3,
  X,
} from "lucide-react";
import { useState } from "react";
import type {
  AIInvestigationResult,
  AIInvestigationStatus,
} from "../../types/ai";
import AIInvestigationStatusComponent from "./AIInvestigationStatus";
import AIInvestigationResultComponent from "./AIInvestigationResult";
import RemediationPanel from "../remediation/RemediationPanel";
import { api, mapApiInvestigation } from "../../api/client";

interface Props {
  incidentId: string;
  incidentTitle?: string;
  onClose: () => void;
}

export default function AIInvestigationPanel({
  incidentId,
  incidentTitle = "Production incident",
  onClose,
}: Props) {
  const [status, setStatus] =
    useState<AIInvestigationStatus>("IDLE");

  const [result, setResult] =
    useState<AIInvestigationResult | null>(null);

  const [remediationOpen, setRemediationOpen] =
    useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startInvestigation() {
    setStatus("COLLECTING_CONTEXT");
    setResult(null);
    setError(null);
    try {
      setStatus("ANALYZING");
      const response = await api.startInvestigation(incidentId);
      if (response.status === "FAILED") {
        setStatus("FAILED");
        setError(response.errorMessage || "The backend investigation failed.");
        return;
      }
      setResult(mapApiInvestigation(response));
      setStatus(response.status === "COMPLETED" ? "COMPLETE" : "ANALYZING");
      if (response.status !== "COMPLETED") {
        setError(`Investigation status: ${response.status}. Check the latest investigation after the backend finishes processing.`);
      }
    } catch (err) {
      setStatus("FAILED");
      setError(err instanceof Error ? err.message : "Could not start the investigation.");
    }
  }

  return (
    <motion.div
      className="workspace-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="workspace-panel flex flex-col"
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 15 }}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg text-white/35 transition hover:bg-white/4 hover:text-white/70"
            >
              <ChevronLeft size={17} />
            </button>

            <div className="grid h-8 w-8 place-items-center rounded-lg border border-emerald-400/15 bg-emerald-400/5 text-emerald-300">
              <BrainCircuit size={16} />
            </div>

            <div>
              <p className="text-xs font-semibold text-white/80">
                AI Investigation
              </p>

              <p className="font-mono text-[9px] text-white/25">
                {incidentId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/30 transition hover:bg-white/4 hover:text-white/70"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="mx-auto max-w-5xl">
              <div className="mb-8">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-400/55">
                  Investigation workspace
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                  {incidentTitle}
                </h2>

                <div className="mt-3 flex items-center gap-4">
                  <AIInvestigationStatusComponent status={status} />

                  <span className="flex items-center gap-1.5 text-[10px] text-white/25">
                    <Clock3 size={12} />
                    Production context
                  </span>
                </div>
              </div>

              {status === "IDLE" && (
                <div className="rounded-2xl border border-white/[0.07] bg-white/1.5 p-8">
                  <div className="mx-auto max-w-xl text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-emerald-400/15 bg-emerald-400/5 text-emerald-300">
                      <BrainCircuit size={25} />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white/85">
                      Investigate this incident
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      Incident will collect relevant production context
                      including logs, metrics, deployments, dependencies
                      and related incidents before analysis.
                    </p>

                    <button
                      onClick={startInvestigation}
                      className="mt-6 rounded-lg bg-emerald-400 px-5 py-2.5 text-xs font-semibold text-[#032118] transition hover:bg-emerald-300"
                    >
                      Start AI investigation
                    </button>
                  </div>
                </div>
              )}

              {error && <div role="alert" className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">{error}</div>}

              {(status === "COLLECTING_CONTEXT" ||
                status === "ANALYZING") && (
                <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/2 p-8">
                  <div className="mx-auto max-w-xl text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-emerald-400/15 bg-emerald-400/4">
                      <BrainCircuit
                        size={25}
                        className="animate-pulse text-emerald-300"
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white/85">
                      {status === "COLLECTING_CONTEXT"
                        ? "Collecting production context"
                        : "Analyzing correlated evidence"}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      {status === "COLLECTING_CONTEXT"
                        ? "Preparing logs, metrics, deployments and dependency information."
                        : "The investigation engine is evaluating relationships between the collected signals."}
                    </p>
                  </div>
                </div>
              )}

              {status === "COMPLETE" && !result && (
                <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/2 p-8">
                  <div className="mx-auto max-w-xl text-center">
                    <h3 className="text-lg font-semibold text-white/85">
                      Investigation workspace ready
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/35">
                      The frontend is ready to render the AI investigation
                      result returned by the backend.
                    </p>

                    <p className="mt-4 font-mono text-[10px] text-white/20">
                      Waiting for investigation API response
                    </p>
                  </div>
                </div>
              )}

              {status === "FAILED" && !error && <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-6 text-sm text-red-300">The investigation failed. Retry after checking the backend logs.</div>}

              {result && (
                <AnimatePresence>
                  <AIInvestigationResultComponent
                    result={result}
                    onReviewRecommendation={() =>
                      setRemediationOpen(true)
                    }
                  />
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {remediationOpen && (
          <RemediationPanel
            onClose={() => setRemediationOpen(false)}
            incidentId={incidentId}
            recommendation={result?.recommendation}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}