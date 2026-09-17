import { ChevronRight } from "lucide-react";

import type { Deployment } from "../../types/operations";
import DeploymentStatus from "./DeploymentStatus";

interface DeploymentTableProps {
  deployments: Deployment[];
  onSelect: (deployment: Deployment) => void;
}

export default function DeploymentTable({
  deployments,
  onSelect,
}: DeploymentTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0b1813]/85">
      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5 text-left">
          <thead className="border-b border-white/8 bg-white/2">
            <tr className="text-xs uppercase tracking-wider text-white/30">
              <th className="px-5 py-4">Service</th>
              <th className="px-5 py-4">Version</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Deployed</th>
              <th className="px-5 py-4">Commit</th>
              <th className="px-5 py-4">Incidents</th>
              <th />
            </tr>
          </thead>

          <tbody className="divide-y divide-white/6">
            {deployments.map((deployment) => (
              <tr
                key={deployment.id}
                onClick={() => onSelect(deployment)}
                className="group cursor-pointer transition hover:bg-white/2.5"
              >
                <td className="px-5 py-4">
                  <p className="font-mono text-sm text-white/70">
                    {deployment.service}
                  </p>

                  <p className="mt-1 font-mono text-[10px] text-white/25">
                    {deployment.id}
                  </p>
                </td>

                <td className="px-5 py-4 font-mono text-xs text-white/50">
                  {deployment.previousVersion}
                  <span className="mx-2 text-white/15">→</span>
                  {deployment.version}
                </td>

                <td className="px-5 py-4">
                  <DeploymentStatus status={deployment.status} />
                </td>

                <td className="px-5 py-4 text-xs text-white/40">
                  {deployment.deployedAt}
                </td>

                <td className="px-5 py-4 font-mono text-xs text-white/35">
                  {deployment.commit}
                </td>

                <td className="px-5 py-4 text-xs text-white/40">
                  {deployment.incidentIds.length}
                </td>

                <td className="px-5 py-4">
                  <ChevronRight
                    size={15}
                    className="text-white/15 transition group-hover:translate-x-1 group-hover:text-emerald-400"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}