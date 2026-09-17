import {
  CheckCircle2,
  CircleDashed,
  Loader2,
  XCircle,
} from "lucide-react";
import type { RemediationState } from "../../types/remediation";

interface Props {
  state: RemediationState;
}

const config = {
  PROPOSED: {
    label: "Awaiting approval",
    icon: CircleDashed,
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
  },
  EXECUTING: {
    label: "Executing remediation",
    icon: Loader2,
  },
  SUCCEEDED: {
    label: "Remediation succeeded",
    icon: CheckCircle2,
  },
  FAILED: {
    label: "Remediation failed",
    icon: XCircle,
  },
};

export default function ExecutionStatus({
  state,
}: Props) {
  const current = config[state];
  const Icon = current.icon;

  return (
    <div className="flex items-center gap-2">
      <Icon
        size={15}
        className={
          state === "REJECTED" || state === "FAILED"
            ? "text-red-400"
            : state === "SUCCEEDED"
              ? "text-emerald-400"
              : "text-amber-300"
        }
      />

      <span className="text-xs text-white/50">
        {current.label}
      </span>
    </div>
  );
}