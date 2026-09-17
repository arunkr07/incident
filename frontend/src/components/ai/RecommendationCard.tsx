import {
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface Props {
  recommendation: string;
  onReview?: () => void;
}

export default function RecommendationCard({
  recommendation,
  onReview,
}: Props) {
  return (
    <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.035] p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-amber-400/15 bg-amber-400/6 text-amber-300">
          <AlertTriangle size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300/70">
            Recommended action
          </p>

          <p className="mt-2 text-sm leading-6 text-white/70">
            {recommendation}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-amber-400/10 pt-4">
        <div className="flex items-center gap-2 text-[10px] text-white/35">
          <ShieldCheck size={13} />
          Manager approval required
        </div>

        {onReview && (
          <button
            onClick={onReview}
            className="flex items-center gap-2 rounded-lg border border-amber-400/15 bg-amber-400/6 px-3 py-2 text-[10px] font-medium text-amber-200 transition hover:bg-amber-400/10"
          >
            Review action
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}