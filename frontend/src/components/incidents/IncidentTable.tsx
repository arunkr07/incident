import { ChevronRight, Clock3 } from "lucide-react";
import type { Incident } from "../../types/incident";
import IncidentStatus from "./IncidentStatus";

interface IncidentTableProps {
  incidents: Incident[];
  onSelect: (incident: Incident) => void;
}

export default function IncidentTable({
  incidents,
  onSelect,
}: IncidentTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0b1813]/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-left">
          <thead className="border-b border-white/8 bg-white/2.5">
            <tr className="text-xs uppercase tracking-wider text-white/40">
              <th className="px-5 py-4 font-medium">Incident</th>
              <th className="px-5 py-4 font-medium">Service</th>
              <th className="px-5 py-4 font-medium">Severity</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Started</th>
              <th className="px-5 py-4 font-medium">Duration</th>
              <th className="px-5 py-4" />
            </tr>
          </thead>

          <tbody className="divide-y divide-white/6">
            {incidents.map((incident) => (
              <tr
                key={incident.id}
                onClick={() => onSelect(incident)}
                className="group cursor-pointer transition hover:bg-white/2.5"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-white/90">
                      {incident.title}
                    </p>

                    <p className="mt-1 font-mono text-xs text-white/35">
                      {incident.id}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-white/65">
                    {incident.service}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <IncidentStatus severity={incident.severity} />
                </td>

                <td className="px-5 py-4">
                  <IncidentStatus status={incident.status} />
                </td>

                <td className="px-5 py-4 text-sm text-white/55">
                  {incident.startedAt}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-white/55">
                    <Clock3 size={14} />
                    {incident.duration}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <ChevronRight
                    size={17}
                    className="text-white/20 transition group-hover:translate-x-1 group-hover:text-emerald-400"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
