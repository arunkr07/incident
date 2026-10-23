import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import ApprovalCard from "./ApprovalCard";
import ExecutionStatus from "./ExecutionStatus";
import { api, type ApiRemediation, type ApiIncident } from "../../api/client";
import type { RemediationState } from "../../types/remediation";

interface Props { incidentId: string; recommendation?: string; onClose: () => void; }
type RemediationType = ApiRemediation["type"];

const toUiState = (status?: ApiRemediation["status"]): RemediationState => {
  if (status === "PENDING_APPROVAL") return "PROPOSED";
  if (status === "APPROVED") return "APPROVED";
  if (status === "REJECTED") return "REJECTED";
  if (status === "EXECUTING") return "EXECUTING";
  if (status === "COMPLETED") return "SUCCEEDED";
  if (status === "FAILED") return "FAILED";
  return "PROPOSED";
};

export default function RemediationPanel({ incidentId, recommendation, onClose }: Props) {
  const [incident, setIncident] = useState<ApiIncident | null>(null);
  const [remediation, setRemediation] = useState<ApiRemediation | null>(null);
  const [actionType, setActionType] = useState<RemediationType>("RESTART_SERVICE");
  const [state, setState] = useState<RemediationState>("PROPOSED");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("Rejected by manager");

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getIncidentRaw(incidentId), api.getRemediations(incidentId)])
      .then(([rawIncident, remediations]) => {
        if (cancelled) return;
        setIncident(rawIncident);
        const existing = remediations[0];
        if (existing) { setRemediation(existing); setState(toUiState(existing.status)); setActionType(existing.type); }
      })
      .catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load remediation state."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [incidentId]);

  async function createRequest() {
    if (!incident) return;
    setSaving(true); setError(null);
    try {
      const created = await api.createRemediation(incidentId, {
        type: actionType, serviceId: incident.serviceId,
        reason: recommendation?.trim() || "Manager-reviewed remediation request",
        risk: "HIGH",
        parameters: JSON.stringify({ recommendation: recommendation ?? "", requestedFrom: "AI investigation UI" }),
      });
      setRemediation(created); setState(toUiState(created.status));
    } catch (err) { setError(err instanceof Error ? err.message : "Could not create approval request."); }
    finally { setSaving(false); }
  }

  async function approve() {
    if (!remediation) return;
    setSaving(true); setError(null);
    try { const updated = await api.approveRemediation(remediation.id); setRemediation(updated); setState(toUiState(updated.status)); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not approve remediation."); }
    finally { setSaving(false); }
  }

  async function reject() {
    if (!remediation) return;
    setSaving(true); setError(null);
    try { const updated = await api.rejectRemediation(remediation.id, rejectReason); setRemediation(updated); setState(toUiState(updated.status)); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not reject remediation."); }
    finally { setSaving(false); }
  }

  async function execute() {
    if (!remediation) return;
    const confirmed = window.confirm("Request execution of this approved remediation? The current backend executor is disabled, so no production action should be performed.");
    if (!confirmed) return;
    setSaving(true); setError(null);
    try { const updated = await api.executeRemediation(remediation.id); setRemediation(updated); setState(toUiState(updated.status)); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not execute remediation."); }
    finally { setSaving(false); }
  }

  return (
    <motion.div className="workspace-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }} className="workspace-panel max-w-[720px]">
        <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-5">
          <div><p className="text-xs font-semibold text-white/80">Remediation review</p><p className="mt-0.5 font-mono text-[9px] text-white/25">Incident #{incidentId}{remediation ? ` · Request #${remediation.id}` : ""}</p></div>
          <button onClick={onClose} aria-label="Close remediation review" className="grid h-8 w-8 place-items-center rounded-lg text-white/30 hover:bg-white/[0.04]"><X size={17} /></button>
        </div>
        <div className="space-y-5 p-6">
          <div className="rounded-xl border border-amber-400/10 bg-amber-400/[0.025] p-5">
            <div className="flex gap-3"><AlertTriangle size={18} className="mt-0.5 text-amber-300" /><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300/70">Approval required</p><h3 className="mt-2 text-sm font-semibold text-white/80">Review recommended remediation</h3><p className="mt-2 text-xs leading-5 text-white/35">Approval is persisted by the backend. Execution is a separate, explicit action.</p></div></div>
          </div>
          {loading ? <p className="text-xs text-white/40">Loading remediation…</p> : <>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-5">
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/25">AI recommendation</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/65">{recommendation || remediation?.reason || "No AI recommendation was supplied. Select an action and provide manager review before requesting approval."}</p>
            </div>
            {!remediation && <div className="space-y-3 rounded-xl border border-white/[0.07] p-5">
              <label className="block text-xs text-white/50">Proposed operation
                <select value={actionType} onChange={(event) => setActionType(event.target.value as RemediationType)} className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#0b1813] px-3 text-xs text-white">
                  <option value="RESTART_SERVICE">Restart service</option><option value="ROLLBACK_DEPLOYMENT">Rollback deployment</option><option value="SCALE_SERVICE">Scale service</option><option value="DISABLE_DEPLOYMENT">Disable deployment</option>
                </select>
              </label>
              <button disabled={saving || !incident} onClick={() => void createRequest()} className="rounded-lg bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-[#032118] disabled:opacity-40">{saving ? "Creating…" : "Create approval request"}</button>
            </div>}
            {remediation && <>
              <ExecutionStatus state={state} />
              {remediation.failureReason && <p className="text-xs text-red-300">{remediation.failureReason}</p>}
              {remediation.executionMessage && <p className="text-xs text-white/40">{remediation.executionMessage}</p>}
              {state === "PROPOSED" && <div className="space-y-3"><label className="block text-xs text-white/40">Rejection reason (if rejecting)<input value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-black/10 px-3 text-xs text-white" /></label><ApprovalCard onApprove={() => void approve()} onReject={() => void reject()} disabled={saving} /></div>}
              {state === "APPROVED" && <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] p-5"><div className="flex gap-3"><ShieldCheck size={18} className="text-emerald-300" /><div><p className="text-sm font-medium text-white/75">Approval recorded</p><p className="mt-1 text-xs leading-5 text-white/35">The backend's current remediation executor is deliberately disabled. An execution request should report that no production action was performed.</p><button disabled={saving} onClick={() => void execute()} className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-xs text-white/70 disabled:opacity-40">{saving ? "Submitting…" : "Request execution"}</button></div></div></div>}
            </>}
          </>}
          {error && <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">{error}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}
