import { useEffect, useMemo, useState } from "react";
import LogDetails from "../components/logs/LogDetails";
import LogFilters from "../components/logs/LogFilters";
import LogTable from "../components/logs/LogTable";
import { api } from "../api/client";
import type { LogEntry, LogLevel, Service } from "../types/operations";

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<LogLevel | "ALL">("ALL");
  const [service, setService] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  useEffect(() => { let cancelled = false; Promise.all([api.getLogs(), api.getServices()]).then(([logData, serviceData]) => { if (!cancelled) { setLogs(logData); setServices(serviceData); } }).catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load logs."); }).finally(() => { if (!cancelled) setLoading(false); }); return () => { cancelled = true; }; }, []);
  const filteredLogs = useMemo(() => { const query = search.toLowerCase(); return logs.filter((log) => (log.message.toLowerCase().includes(query) || log.service.toLowerCase().includes(query) || log.traceId?.toLowerCase().includes(query) || log.requestId?.toLowerCase().includes(query)) && (level === "ALL" || log.level === level) && (service === "ALL" || log.service === service)); }, [logs, search, level, service]);
  return <div className="space-y-6"><header><p className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">Observability</p><h1 className="mt-2 text-2xl font-semibold text-white">Logs</h1><p className="mt-2 text-sm text-white/40">Search and inspect production logs emitted by monitored services.</p></header>
    {error && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">Could not load logs: {error}</div>}
    <LogFilters search={search} level={level} service={service} services={services.map((item) => item.name)} onSearchChange={setSearch} onLevelChange={setLevel} onServiceChange={setService}/>
    {loading ? <p className="py-8 text-center text-sm text-white/35">Loading logs…</p> : filteredLogs.length ? <LogTable logs={filteredLogs} onSelect={setSelectedLog}/> : <div className="rounded-2xl border border-white/8 bg-[#0b1813]/85 py-12 text-center text-sm text-white/35">{error ? "Log data is unavailable until the API request succeeds." : "No logs match the selected filters."}</div>}
    {selectedLog && <LogDetails log={selectedLog} onClose={() => setSelectedLog(null)}/>}
  </div>;
}
