import {
  BrainCircuit,
  CheckCircle2,
  CircleDashed,
  Loader2,
  XCircle,
} from "lucide-react";
import type { AIInvestigationStatus } from "../../types/ai";

interface Props {
  status: AIInvestigationStatus;
}

const config = {
  IDLE: {
    label: "Ready",
    icon: CircleDashed,
  },
  COLLECTING_CONTEXT: {
    label: "Collecting production context",
    icon: Loader2,
  },
  ANALYZING: {
    label: "AI analyzing evidence",
    icon: BrainCircuit,
  },
  COMPLETE: {
    label: "Investigation complete",
    icon: CheckCircle2,
  },
  FAILED: {
    label: "Investigation failed",
    icon: XCircle,
  },
};

export default function AIInvestigationStatus({
  status,
}: Props) {
  const item = config[status];
  const Icon = item.icon;

  return (
    <div className="flex items-center gap-2 text-xs text-white/55">
      <Icon
        size={16}
        className={
          status === "FAILED"
            ? "text-red-400"
            : status === "COMPLETE"
              ? "text-emerald-400"
              : "text-emerald-300"
        }
        style={
          status === "COLLECTING_CONTEXT" ||
          status === "ANALYZING"
            ? {
                animation: "spin 1.5s linear infinite",
              }
            : undefined
        }
      />

      <span>{item.label}</span>
    </div>
  );
}