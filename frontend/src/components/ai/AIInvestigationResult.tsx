import { BrainCircuit, Target } from "lucide-react";
import type { AIInvestigationResult } from "../../types/ai";
import EvidenceList from "./EvidenceList";
import RecommendationCard from "./RecommendationCard";

interface Props {
  result: AIInvestigationResult;
  onReviewRecommendation?: () => void;
}

export default function AIInvestigationResult({
  result,
  onReviewRecommendation,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/2.5 p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-emerald-400/15 bg-emerald-400/6 text-emerald-300">
            <BrainCircuit size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/70">
              Root cause hypothesis
            </p>

            <h3 className="mt-2 text-base font-semibold text-white/90">
              {result.hypothesis}
            </h3>

            <p className="mt-2 text-xs leading-5 text-white/40">
              {result.summary}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-mono text-xl font-semibold text-emerald-300">
              {result.confidence}%
            </p>

            <p className="text-[9px] uppercase tracking-wider text-white/25">
              confidence
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Target size={14} className="text-white/40" />

          <h3 className="text-xs font-semibold text-white/65">
            Correlated evidence
          </h3>
        </div>

        <EvidenceList evidence={result.evidence} />
      </div>

      <RecommendationCard
        recommendation={result.recommendation}
        onReview={onReviewRecommendation}
      />
    </div>
  );
}