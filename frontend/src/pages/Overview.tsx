import { AlertTriangle, Activity, CircleCheck, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActiveIncidents from "../components/overview/ActiveIncidents";
import RecentEvents from "../components/overview/RecentEvents";
import SystemHealth from "../components/overview/SystemHealth";
import { api } from "../api/client";
import type { Incident } from "../types/incident";
import type { Deployment, Service } from "../types/operations";

export default function Overview() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getIncidents(), api.getServices(), api.getDeployments()])
      .then(([incidentData, serviceData, deploymentData]) => {
        if (cancelled) return;
        setIncidents(incidentData);
        setServices(serviceData);
        setDeployments(deploymentData);
      })
      .catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load dashboard data."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const activeCount = incidents.filter((incident) => incident.status !== "RESOLVED").length;
  const criticalCount = incidents.filter((incident) => incident.severity === "CRITICAL" && incident.status !== "RESOLVED").length;
  const degradedCount = services.filter((service) => service.status === "DEGRADED" || service.status === "DOWN").length;
  const productionState = services.length === 0 ? "Unknown" : degradedCount > 0 ? "Degraded" : "Healthy";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">Production</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">System overview</h1>
        <p className="mt-2 text-sm text-white/40">Current production state and incidents requiring attention.</p>
      </div>

      {error && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">Dashboard data could not be loaded: {error}</div>}
      {loading && <p className="text-sm text-white/35">Loading live production data…</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewMetric icon={<AlertTriangle size={18} />} label="Active incidents" value={loading ? "—" : String(activeCount)} detail="Currently open" />
        <OverviewMetric icon={<AlertTriangle size={18} />} label="Critical" value={loading ? "—" : String(criticalCount)} detail="Immediate attention" />
        <OverviewMetric icon={<Activity size={18} />} label="Production state" value={loading ? "—" : productionState} detail={services.length ? `${degradedCount} services degraded or down` : "No services registered"} />
        <OverviewMetric icon={<Clock3 size={18} />} label="Monitoring" value={loading ? "—" : "API connected"} detail={`${services.length} services · ${deployments.length} deployments`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SystemHealth services={services} />
        <ActiveIncidents incidents={incidents} onSelect={(incident) => navigate(`/incidents/${incident.id}`)} />
      </div>
      <RecentEvents incidents={incidents} deployments={deployments} />
    </div>
  );
}

function OverviewMetric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <div className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-5"><div className="flex items-center justify-between"><div className="rounded-lg border border-white/7 bg-white/3 p-2 text-white/45">{icon}</div>{label === "Production state" ? <CircleCheck size={16} className="text-orange-400" /> : null}</div><p className="mt-5 text-xs uppercase tracking-wider text-white/30">{label}</p><p className="mt-1 text-2xl font-semibold text-white">{value}</p><p className="mt-1 text-xs text-white/30">{detail}</p></div>;
}
