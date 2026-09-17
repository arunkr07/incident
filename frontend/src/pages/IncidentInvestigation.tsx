import { useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import IncidentDetails from "../components/incidents/IncidentDetails";
import IncidentLogs from "../components/incidents/IncidentLogs";
import IncidentMetrics from "../components/incidents/IncidentMetrics";
import IncidentOverview from "../components/incidents/IncidentOverview";
import IncidentTimeline from "../components/incidents/IncidentTimeline";

import AIInvestigationPanel from "../components/ai/AIInvestigationPanel";

import { investigationData } from "../data/incidentData";

export default function IncidentInvestigation() {
  const navigate = useNavigate();
  const { incidentId } = useParams();

  const [aiInvestigationOpen, setAIInvestigationOpen] =
    useState(false);

  /*
   * Temporary lookup.
   *
   * Once the backend is connected:
   *
   * GET /api/incidents/{incidentId}
   *
   * will provide this investigation context.
   */

  const investigation = investigationData;

  if (!investigation || investigation.incident.id !== incidentId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-lg font-medium text-white">
          Incident not found
        </p>

        <button
          onClick={() => navigate("/incidents")}
          className="mt-4 text-sm text-emerald-400 transition hover:text-emerald-300"
        >
          Return to incidents
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate("/incidents")}
          className="flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to incidents
        </button>

        <div className="flex items-center gap-2">
          {/* AI Investigation */}
          <button
            onClick={() => setAIInvestigationOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/15"
          >
            <BrainCircuit size={15} />
            AI investigation
          </button>

          {/* More actions */}
          <button
            className="rounded-lg border border-white/8 bg-white/2.5 p-2 text-white/40 transition hover:text-white"
          >
            <MoreHorizontal size={17} />
          </button>
        </div>
      </div>

      {/* Incident overview */}
      <IncidentOverview incident={investigation.incident} />

      {/* Timeline + details */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <IncidentTimeline events={investigation.timeline} />

        <IncidentDetails investigation={investigation} />
      </div>

      {/* Metrics */}
      <IncidentMetrics
        errorRate={investigation.metrics.errorRate}
        latency={investigation.metrics.latency}
      />

      {/* Logs */}
      <IncidentLogs logs={investigation.logs} />

      {/* AI Investigation Workspace */}
      {aiInvestigationOpen && (
        <AIInvestigationPanel
          incidentId={incidentId ?? ""}
          incidentTitle={investigation.incident.title}
          onClose={() => setAIInvestigationOpen(false)}
        />
      )}
    </div>
  );
}