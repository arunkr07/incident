import { ShieldCheck } from "lucide-react";

export default function ApprovalSettings() {
  return (
    <section className="settings-section">
      <div><h2>Production approvals</h2><p>Approval policy enforced by the remediation backend.</p></div>
      <div className="settings-option">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="mt-0.5 text-emerald-300" />
          <div><p>Manager approval is required for every remediation</p><span>The backend accepts execution only after the request reaches APPROVED status. This is enforced server-side and cannot be disabled by a frontend preference.</span></div>
        </div>
        <input type="checkbox" checked readOnly aria-label="Manager approval required" />
      </div>
      <p className="text-[10px] leading-5 text-white/30">The current executor is intentionally disabled until a production remediation integration is configured. Approving a request does not itself change production.</p>
    </section>
  );
}
