import { GitCommitHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DeploymentTable from "../components/deployments/DeploymentTable";
import { deployments } from "../data/operationsData";

export default function Deployments() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">
          Delivery
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-white">
          Deployments
        </h1>

        <p className="mt-2 text-sm text-white/40">
          Production deployments and their relationship to incidents.
        </p>
      </header>

      <div className="flex items-center gap-2 text-xs text-white/35">
        <GitCommitHorizontal
          size={14}
          className="text-emerald-400"
        />
        Deployment history
      </div>

      <DeploymentTable
        deployments={deployments}
        onSelect={(deployment) =>
          navigate(`/deployments/${deployment.id}`)
        }
      />
    </div>
  );
}