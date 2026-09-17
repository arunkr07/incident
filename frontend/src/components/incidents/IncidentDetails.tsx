import {
  BrainCircuit,
  GitBranch,
  ShieldAlert,
} from "lucide-react";
import type { IncidentInvestigation } from "../../types/incident";

interface IncidentDetailsProps {
  investigation: IncidentInvestigation;
}

export default function IncidentDetails({
  investigation,
}: IncidentDetailsProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400">
            <BrainCircuit size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <p className="text-sm font-semibold text-white">
                  AI investigation
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Current machine-generated hypothesis based on collected evidence.
                </p>
              </div>

              {investigation.confidence !== undefined && (
                <div className="text-left sm:text-right">
                  <p className="text-xs uppercase tracking-wider text-white/30">
                    Confidence
                  </p>

                  <p className="mt-1 text-lg font-semibold text-emerald-400">
                    {investigation.confidence}%
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-wider text-white/30">
                Root cause hypothesis
              </p>

              <p className="mt-2 text-sm leading-7 text-white/65">
                {investigation.rootCause ??
                  "Investigation has not produced a root-cause hypothesis yet."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {investigation.evidence &&
        investigation.evidence.length > 0 && (
          <section className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6">
            <div className="flex items-center gap-2">
              <GitBranch size={17} className="text-white/50" />

              <p className="text-sm font-semibold text-white">
                Evidence
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {investigation.evidence.map((evidence, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-white/6 bg-white/2 p-4"
                >
                  <span className="font-mono text-xs text-emerald-500/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="text-sm leading-6 text-white/55">
                    {evidence}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

      <section className="rounded-2xl border border-orange-500/15 bg-orange-500/[0.035] p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-2 text-orange-400">
            <ShieldAlert size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Recommended action
            </p>

            <p className="mt-3 text-sm leading-7 text-white/60">
              {investigation.recommendation ??
                "No remediation recommendation is available yet."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}