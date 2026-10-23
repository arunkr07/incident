import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceTable from "../components/services/ServiceTable";
import { api } from "../api/client";
import type { Service } from "../types/operations";

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let cancelled = false; api.getServices().then((data) => { if (!cancelled) setServices(data); }).catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load services."); }).finally(() => { if (!cancelled) setLoading(false); }); return () => { cancelled = true; }; }, []);
  const degraded = services.filter((service) => service.status === "DEGRADED" || service.status === "DOWN").length;
  const operational = services.filter((service) => service.status === "OPERATIONAL").length;
  return <div className="space-y-6"><header><p className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">Infrastructure</p><h1 className="mt-2 text-2xl font-semibold text-white">Services</h1><p className="mt-2 text-sm text-white/40">Monitored production services and their current operational state.</p></header>
    {error && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">Could not load services: {error}</div>}
    <div className="grid gap-4 sm:grid-cols-3"><Summary label="Total services" value={loading ? "—" : services.length}/><Summary label="Operational" value={loading ? "—" : operational}/><Summary label="Degraded / down" value={loading ? "—" : degraded}/></div>
    <div className="flex items-center gap-2 text-xs text-white/35"><Activity size={14} className="text-emerald-400"/>Service state reported by the backend</div>
    {loading ? <p className="py-8 text-center text-sm text-white/35">Loading services…</p> : services.length ? <ServiceTable services={services} onSelect={(service) => navigate(`/services/${service.id}`)}/> : <div className="rounded-2xl border border-white/8 bg-[#0b1813]/85 py-12 text-center text-sm text-white/35">{error ? "Service data is unavailable until the API request succeeds." : "No services have been registered yet."}</div>}
  </div>;
}
function Summary({ label, value }: { label: string; value: string | number }) { return <div className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-5"><p className="text-xs uppercase tracking-wider text-white/30">{label}</p><p className="mt-2 text-2xl font-semibold text-white">{value}</p></div>; }
