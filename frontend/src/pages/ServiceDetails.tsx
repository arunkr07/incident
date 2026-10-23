import { useEffect, useState } from "react";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DependencyMap from "../components/services/DependencyMap";
import ServiceHealth from "../components/services/ServiceHealth";
import ServiceMetrics from "../components/services/ServiceMetrics";
import { api, mapService } from "../api/client";
import type { Service, ServiceDependency } from "../types/operations";

export default function ServiceDetails() {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [dependencies, setDependencies] = useState<ServiceDependency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let cancelled = false; if (!serviceId || !/^\d+$/.test(serviceId)) { setLoading(false); setError("Invalid service identifier."); return; } Promise.all([api.getServiceRaw(serviceId), api.getDependencies().catch(() => [] as ServiceDependency[]), api.getMetricsRaw(Number(serviceId)).catch(() => [])]).then(([raw, deps, metrics]) => { if (!cancelled) { setService(mapService(raw, metrics)); setDependencies(deps.filter((d) => d.source === serviceId || d.target === serviceId)); } }).catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load service."); }).finally(() => { if (!cancelled) setLoading(false); }); return () => { cancelled = true; }; }, [serviceId]);
  if (loading) return <p className="py-20 text-center text-sm text-white/35">Loading service…</p>;
  if (!service) return <div className="py-20 text-center"><p className="text-white">{error ?? "Service not found."}</p><button onClick={() => navigate("/services")} className="mt-4 text-sm text-emerald-400">Back to services</button></div>;
  return <div className="space-y-6"><button onClick={() => navigate("/services")} className="flex items-center gap-2 text-sm text-white/40 hover:text-white"><ArrowLeft size={16}/>Back to services</button>{error && <p role="alert" className="text-sm text-red-300">Some service data could not be loaded: {error}</p>}<section className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6"><div className="flex flex-col justify-between gap-5 md:flex-row"><div><div className="flex flex-wrap items-center gap-3"><h1 className="font-mono text-xl font-semibold text-white">{service.name}</h1><ServiceHealth status={service.status}/></div><p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">{service.description || "No service description is available."}</p>{service.endpoint && <p className="mt-2 break-all font-mono text-xs text-white/30">{service.endpoint}</p>}</div><button disabled className="flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-xs font-medium text-white/30" title="Service investigation is not exposed by the current backend API"><BrainCircuit size={15}/>Investigate service</button></div><div className="mt-7"><ServiceMetrics service={service}/></div></section><DependencyMap dependencies={dependencies}/></div>;
}
