import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DeploymentDetailsCard from "../components/deployments/DeploymentDetails";
import { api, mapDeployment } from "../api/client";
import type { Deployment } from "../types/operations";

export default function DeploymentDetails() {
  const navigate = useNavigate();
  const { deploymentId } = useParams();
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let cancelled = false; if (!deploymentId || !/^\d+$/.test(deploymentId)) { setLoading(false); setError("Invalid deployment identifier."); return; } api.getDeploymentRaw(deploymentId).then((raw) => { if (!cancelled) setDeployment(mapDeployment(raw)); }).catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load deployment."); }).finally(() => { if (!cancelled) setLoading(false); }); return () => { cancelled = true; }; }, [deploymentId]);
  if (loading) return <p className="py-20 text-center text-sm text-white/35">Loading deployment…</p>;
  if (!deployment) return <div className="py-20 text-center"><p className="text-white">{error ?? "Deployment not found."}</p><button onClick={() => navigate("/deployments")} className="mt-4 text-sm text-emerald-400">Back to deployments</button></div>;
  return <div className="space-y-6"><button onClick={() => navigate("/deployments")} className="flex items-center gap-2 text-sm text-white/40 hover:text-white"><ArrowLeft size={16}/>Back to deployments</button><DeploymentDetailsCard deployment={deployment}/></div>;
}
