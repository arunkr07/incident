import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DeploymentDetailsCard from "../components/deployments/DeploymentDetails";
import { deployments } from "../data/operationsData";

export default function DeploymentDetails() {
  const navigate = useNavigate();
  const { deploymentId } = useParams();

  const deployment = deployments.find(
    (item) => item.id === deploymentId,
  );

  if (!deployment) {
    return (
      <div className="py-20 text-center">
        <p className="text-white">Deployment not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/deployments")}
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to deployments
      </button>

      <DeploymentDetailsCard deployment={deployment} />
    </div>
  );
}