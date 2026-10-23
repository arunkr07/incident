import { useEffect, useState } from "react";
import { ArrowLeft, BrainCircuit, MoreHorizontal } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import IncidentDetails from "../components/incidents/IncidentDetails";
import IncidentLogs from "../components/incidents/IncidentLogs";
import IncidentMetrics from "../components/incidents/IncidentMetrics";
import IncidentOverview from "../components/incidents/IncidentOverview";
import IncidentTimeline from "../components/incidents/IncidentTimeline";
import AIInvestigationPanel from "../components/ai/AIInvestigationPanel";
import { api, buildInvestigation, type ApiInvestigation } from "../api/client";
import type { IncidentInvestigation as InvestigationModel } from "../types/incident";

export default function IncidentInvestigation() {
  const navigate = useNavigate();
  const { incidentId } = useParams();
  const [aiInvestigationOpen, setAIInvestigationOpen] = useState(false);
  const [investigation, setInvestigation] = useState<InvestigationModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiRefresh, setAiRefresh] = useState(0);
  useEffect(() => {
    let cancelled = false;
    if (!incidentId || !/^\d+$/.test(incidentId)) { setLoading(false); setError("This incident link is not a backend incident ID. Open an incident from the live incident list."); return; }
    setLoading(true); setError(null);
    (async () => {
      const rawIncident = await api.getIncidentRaw(incidentId);
      const [timeline, rawLogs, rawMetrics, ai] = await Promise.all([
        api.getTimeline(incidentId),
        api.getLogsRaw(rawIncident.serviceId),
        api.getMetricsRaw(rawIncident.serviceId),
        api.getLatestInvestigation(incidentId).catch(() => undefined as ApiInvestigation | undefined),
      ]);
      if (!cancelled) setInvestigation(buildInvestigation(rawIncident, timeline, rawLogs, rawMetrics, ai));
    })().catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load incident details."); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [incidentId, aiRefresh]);

  if (loading) return <p className="py-20 text-center text-sm text-white/35">Loading incident details…</p>;
  if (!investigation) return <div className="flex min-h-[60vh] flex-col items-center justify-center"><p className="text-lg font-medium text-white">{error ?? "Incident not found"}</p><button onClick={() => navigate("/incidents")} className="mt-4 text-sm text-emerald-400 transition hover:text-emerald-300">Return to incidents</button></div>;
  return <div className="space-y-6"><div className="flex items-center justify-between gap-4"><button onClick={() => navigate("/incidents")} className="flex items-center gap-2 text-sm text-white/40 transition hover:text-white"><ArrowLeft size={16}/>Back to incidents</button><div className="flex items-center gap-2"><button onClick={() => setAIInvestigationOpen(true)} className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/15"><BrainCircuit size={15}/>AI investigation</button><button aria-label="More incident actions" className="rounded-lg border border-white/8 bg-white/2.5 p-2 text-white/40 transition hover:text-white"><MoreHorizontal size={17}/></button></div></div>
    {error && <p role="alert" className="text-sm text-red-300">Some investigation data could not be loaded: {error}</p>}
    <IncidentOverview incident={investigation.incident}/><div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><IncidentTimeline events={investigation.timeline}/><IncidentDetails investigation={investigation}/></div>
    <IncidentMetrics errorRate={investigation.metrics.errorRate} latency={investigation.metrics.latency}/><IncidentLogs logs={investigation.logs}/>
    {aiInvestigationOpen && <AIInvestigationPanel incidentId={incidentId ?? ""} incidentTitle={investigation.incident.title} onClose={() => { setAIInvestigationOpen(false); setAiRefresh((n) => n + 1); }}/>}</div>;
}
