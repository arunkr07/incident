import {
  GitBranch,
  GitCommitHorizontal,
  Server,
} from "lucide-react";

import type { Deployment } from "../../types/operations";
import DeploymentStatus from "./DeploymentStatus";

interface DeploymentDetailsProps {
  deployment: Deployment;
}

export default function DeploymentDetails({
  deployment,
}: DeploymentDetailsProps) {
  return (
    <section className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row">
        <div>
          <div className="flex items-center gap-3">
            <Server size={18} className="text-emerald-400" />

            <p className="font-mono text-sm text-white/80">
              {deployment.service}
            </p>

            <DeploymentStatus status={deployment.status} />
          </div>

          <p className="mt-3 font-mono text-xs text-white/30">
            {deployment.id}
          </p>
        </div>

        <p className="font-mono text-xs text-white/30">
          {deployment.deployedAt}
        </p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Info
          icon={<GitCommitHorizontal size={15} />}
          label="Commit"
          value={deployment.commit}
        />

        <Info
          icon={<GitBranch size={15} />}
          label="Branch"
          value={deployment.branch}
        />

        <Info
          label="Previous version"
          value={deployment.previousVersion}
        />

        <Info
          label="Deployed version"
          value={deployment.version}
        />
      </div>

      <div className="mt-6 rounded-xl border border-white/7 bg-white/2 p-5">
        <p className="text-xs uppercase tracking-wider text-white/25">
          Change summary
        </p>

        <p className="mt-3 text-sm leading-7 text-white/55">
          {deployment.changeSummary}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-xs uppercase tracking-wider text-white/25">
          Related incidents
        </p>

        {deployment.incidentIds.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {deployment.incidentIds.map((id) => (
              <span
                key={id}
                className="rounded-lg border border-orange-500/15 bg-orange-500/5 px-3 py-2 font-mono text-xs text-orange-300"
              >
                {id}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-white/30">
            No incidents are currently associated with this deployment.
          </p>
        )}
      </div>
    </section>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-white/25">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 font-mono text-xs text-white/55">
        {value}
      </p>
    </div>
  );
}