import { ArrowUpRight, CircleAlert } from "lucide-react";
import type { Incident } from "../../types/incident";
import IncidentStatus from "../incidents/IncidentStatus";

interface ActiveIncidentsProps {
  incidents: Incident[];
  onSelect: (incident: Incident) => void;
}

export default function ActiveIncidents({
  incidents,
  onSelect,
}: ActiveIncidentsProps) {
  const active = incidents.filter(
    (incident) => incident.status !== "RESOLVED",
  );

  return (
    <section className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Active incidents
          </p>

          <p className="mt-1 text-xs text-white/35">
            Incidents currently requiring attention.
          </p>
        </div>

        <CircleAlert size={18} className="text-orange-400" />
      </div>

      <div className="mt-5 space-y-2">
        {active.map((incident) => (
          <button
            key={incident.id}
            onClick={() => onSelect(incident)}
            className="group flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/2 p-4 text-left transition hover:border-white/10 hover:bg-white/4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white/75">
                {incident.title}
              </p>

              <p className="mt-1 font-mono text-xs text-white/30">
                {incident.service}
              </p>
            </div>

            <div className="ml-4 flex items-center gap-3">
              <IncidentStatus severity={incident.severity} />

              <ArrowUpRight
                size={15}
                className="text-white/20 transition group-hover:text-emerald-400"
              />
            </div>
          </button>
        ))}

        {active.length === 0 && (
          <p className="py-8 text-center text-sm text-white/35">
            No active incidents.
          </p>
        )}
      </div>
    </section>
  );
}