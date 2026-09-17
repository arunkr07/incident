import {
  Activity,
  AlertCircle,
  GitBranch,
  Network,
  ScrollText,
} from "lucide-react";
import type { InvestigationEvidence } from "../../types/ai";

interface Props {
  evidence: InvestigationEvidence[];
}

const icons = {
  LOG: ScrollText,
  METRIC: Activity,
  DEPLOYMENT: GitBranch,
  DEPENDENCY: Network,
  INCIDENT: AlertCircle,
};

export default function EvidenceList({ evidence }: Props) {
  if (evidence.length === 0) {
    return (
      <div className="rounded-xl border border-white/6 bg-white/1.5 p-6 text-center">
        <p className="text-sm text-white/35">
          No correlated evidence yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {evidence.map((item) => {
        const Icon = icons[item.source];

        return (
          <div
            key={item.id}
            className="rounded-xl border border-white/6 bg-white/1.5 p-4"
          >
            <div className="flex gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-white/2.5 text-emerald-300">
                <Icon size={15} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-white/75">
                    {item.title}
                  </p>

                  <span
                    className={`shrink-0 text-[9px] font-medium uppercase tracking-wider ${
                      item.relevance === "HIGH"
                        ? "text-red-300"
                        : item.relevance === "MEDIUM"
                          ? "text-amber-300"
                          : "text-white/30"
                    }`}
                  >
                    {item.relevance}
                  </span>
                </div>

                <p className="mt-1 text-[11px] leading-5 text-white/35">
                  {item.description}
                </p>

                {item.timestamp && (
                  <p className="mt-2 font-mono text-[9px] text-white/20">
                    {item.timestamp}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}