import {
  Activity,
  AlertTriangle,
  Clock3,
  Server,
} from "lucide-react";
import type { Incident } from "../../types/incident";
import IncidentStatus from "./IncidentStatus";

interface IncidentOverviewProps {
  incident: Incident;
}

export default function IncidentOverview({
  incident,
}: IncidentOverviewProps) {
  return (
    <section className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <IncidentStatus severity={incident.severity} />
            <IncidentStatus status={incident.status} />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {incident.title}
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
            {incident.description}
          </p>
        </div>

        <div className="font-mono text-sm text-white/35">
          {incident.id}
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          icon={<Server size={16} />}
          label="Service"
          value={incident.service}
        />

        <Metric
          icon={<Clock3 size={16} />}
          label="Started"
          value={incident.startedAt}
        />

        <Metric
          icon={<Activity size={16} />}
          label="Error rate"
          value={incident.errorRate ?? "—"}
        />

        <Metric
          icon={<AlertTriangle size={16} />}
          label="Affected users"
          value={incident.affectedUsers ?? "—"}
        />
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/7 bg-black/10 p-4">
      <div className="flex items-center gap-2 text-white/35">
        {icon}
        <span className="text-xs uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-3 truncate text-sm font-medium text-white/80">
        {value}
      </p>
    </div>
  );
}