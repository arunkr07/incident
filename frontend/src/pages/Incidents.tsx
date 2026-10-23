import { Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import IncidentTable from "../components/incidents/IncidentTable";
import { api } from "../api/client";
import type { Incident, IncidentSeverity, IncidentStatus } from "../types/incident";

export default function Incidents() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [severity, setSeverity] = useState<IncidentSeverity | "ALL">("ALL");
  const [status, setStatus] = useState<IncidentStatus | "ALL">("ALL");

  useEffect(() => { let cancelled = false; api.getIncidents().then((data) => { if (!cancelled) setIncidents(data); }).catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load incidents."); }).finally(() => { if (!cancelled) setLoading(false); }); return () => { cancelled = true; }; }, []);

  const filteredIncidents = useMemo(() => incidents.filter((incident) => {
    const query = search.toLowerCase();
    const matchesSearch = incident.title.toLowerCase().includes(query) || incident.id.toLowerCase().includes(query) || incident.service.toLowerCase().includes(query);
    return matchesSearch && (severity === "ALL" || incident.severity === severity) && (status === "ALL" || incident.status === status);
  }), [incidents, search, severity, status]);

  return <div className="space-y-6"><div><p className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">Operations</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Incidents</h1><p className="mt-2 text-sm text-white/40">Production incidents detected and managed by the system.</p></div>
    {error && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">Could not load incidents: {error}</div>}
    <div className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-4"><div className="flex flex-col gap-3 lg:flex-row"><div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search incidents, services or IDs..." className="h-10 w-full rounded-lg border border-white/8 bg-black/10 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-emerald-500/30"/></div><div className="flex gap-3"><Select icon={<Filter size={14}/>} value={severity} onChange={(value) => setSeverity(value as IncidentSeverity | "ALL")} options={["ALL","CRITICAL","HIGH","MEDIUM","LOW"]}/><Select value={status} onChange={(value) => setStatus(value as IncidentStatus | "ALL")} options={["ALL","DETECTED","INVESTIGATING","ACKNOWLEDGED","RESOLVED"]}/></div></div></div>
    {loading ? <p className="py-8 text-center text-sm text-white/35">Loading incidents…</p> : filteredIncidents.length ? <IncidentTable incidents={filteredIncidents} onSelect={(incident) => navigate(`/incidents/${incident.id}`)}/> : <div className="rounded-2xl border border-white/8 bg-[#0b1813]/85 py-12 text-center text-sm text-white/35">{error ? "Incident data is unavailable until the API request succeeds." : "No incidents match the selected filters."}</div>}
  </div>;
}
function Select({ icon, value, onChange, options }: { icon?: React.ReactNode; value: string; onChange: (value: string) => void; options: string[] }) { return <div className="relative">{icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30">{icon}</span>}<select value={value} onChange={(event) => onChange(event.target.value)} className={`h-10 appearance-none rounded-lg border border-white/8 bg-black/10 pr-9 text-xs text-white/60 outline-none focus:border-emerald-500/30 ${icon ? "pl-9" : "pl-3"}`}>{options.map((option) => <option key={option} value={option} className="bg-[#0b1813]">{option.replaceAll("_", " ")}</option>)}</select></div>; }
