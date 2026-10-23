import { GitCommitHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeploymentTable from "../components/deployments/DeploymentTable";
import { api } from "../api/client";
import type { Deployment } from "../types/operations";

export default function Deployments() {
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let cancelled = false; api.getDeployments().then((data) => { if (!cancelled) setDeployments(data); }).catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load deployments."); }).finally(() => { if (!cancelled) setLoading(false); }); return () => { cancelled = true; }; }, []);
  return <div className="space-y-6"><header><p className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">Delivery</p><h1 className="mt-2 text-2xl font-semibold text-white">Deployments</h1><p className="mt-2 text-sm text-white/40">Production deployments and their relationship to incidents.</p></header>
    {error && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">Could not load deployments: {error}</div>}
    <div className="flex items-center gap-2 text-xs text-white/35"><GitCommitHorizontal size={14} className="text-emerald-400"/>Deployment history from the backend</div>
    {loading ? <p className="py-8 text-center text-sm text-white/35">Loading deployments…</p> : deployments.length ? <DeploymentTable deployments={deployments} onSelect={(deployment) => navigate(`/deployments/${deployment.id}`)}/> : <div className="rounded-2xl border border-white/8 bg-[#0b1813]/85 py-12 text-center text-sm text-white/35">{error ? "Deployment data is unavailable until the API request succeeds." : "No deployments have been recorded yet."}</div>}
  </div>;
}
