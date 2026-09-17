import {
  Check,
  ShieldAlert,
  X,
} from "lucide-react";

interface Props {
  onApprove: () => void;
  onReject: () => void;
  disabled?: boolean;
}

export default function ApprovalCard({
  onApprove,
  onReject,
  disabled,
}: Props) {
  return (
    <div className="rounded-xl border border-amber-400/15 bg-amber-400/2.5 p-5">
      <div className="flex gap-3">
        <ShieldAlert
          size={18}
          className="mt-0.5 shrink-0 text-amber-300"
        />

        <div>
          <h3 className="text-sm font-semibold text-white/80">
            Manager approval required
          </h3>

          <p className="mt-1 text-xs leading-5 text-white/35">
            This action can change production state. Review the proposed
            operation before execution.
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          disabled={disabled}
          onClick={onReject}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/8 px-3 py-2.5 text-xs text-white/50 transition hover:bg-white/[0.035] disabled:opacity-40"
        >
          <X size={14} />
          Reject
        </button>

        <button
          disabled={disabled}
          onClick={onApprove}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-3 py-2.5 text-xs font-semibold text-[#032118] transition hover:bg-emerald-300 disabled:opacity-40"
        >
          <Check size={14} />
          Approve
        </button>
      </div>
    </div>
  );
}