import { motion } from "framer-motion";
import {
  AlertTriangle,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import ApprovalCard from "./ApprovalCard";
import ExecutionStatus from "./ExecutionStatus";
import type { RemediationState } from "../../types/remediation";

interface Props {
  incidentId: string;
  onClose: () => void;
}

export default function RemediationPanel({
  incidentId,
  onClose,
}: Props) {
  const [state, setState] =
    useState<RemediationState>("PROPOSED");

  function approve() {
    setState("APPROVED");
  }

  function reject() {
    setState("REJECTED");
  }

  return (
    <motion.div
      className="workspace-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        className="workspace-panel max-w-[720px]"
      >
        <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-5">
          <div>
            <p className="text-xs font-semibold text-white/80">
              Remediation review
            </p>

            <p className="mt-0.5 font-mono text-[9px] text-white/25">
              {incidentId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/30 hover:bg-white/[0.04]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-xl border border-red-400/10 bg-red-400/[0.025] p-5">
            <div className="flex gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 text-red-300"
              />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-300/70">
                  Production change
                </p>

                <h3 className="mt-2 text-sm font-semibold text-white/80">
                  Review recommended remediation
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  The AI investigation has proposed a production-changing
                  action. The backend will validate the manager's approval
                  before execution.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-5">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/25">
              Proposed action
            </p>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Recommended remediation returned by the AI investigation.
            </p>
          </div>

          <ExecutionStatus state={state} />

          {state === "PROPOSED" && (
            <ApprovalCard
              onApprove={approve}
              onReject={reject}
            />
          )}

          {state === "APPROVED" && (
            <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] p-5">
              <div className="flex gap-3">
                <ShieldCheck
                  size={18}
                  className="text-emerald-300"
                />

                <div>
                  <p className="text-sm font-medium text-white/75">
                    Approval recorded
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    The backend execution workflow will take over here
                    and monitor recovery.
                  </p>
                </div>
              </div>
            </div>
          )}

          {state === "REJECTED" && (
            <div className="rounded-xl border border-red-400/10 bg-red-400/[0.025] p-5">
              <p className="text-sm font-medium text-white/70">
                Remediation rejected
              </p>

              <p className="mt-1 text-xs text-white/35">
                No production change was authorized.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}