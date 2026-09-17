import {
  AlertTriangle,
  Activity,
  CircleCheck,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ActiveIncidents from "../components/overview/ActiveIncidents";
import RecentEvents from "../components/overview/RecentEvents";
import SystemHealth from "../components/overview/SystemHealth";
import { criticalIncidentCount, incidents } from "../data/incidentData";

export default function Overview() {
  const navigate = useNavigate();

  const activeCount = incidents.filter(
    (incident) => incident.status !== "RESOLVED",
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">
          Production
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          System overview
        </h1>

        <p className="mt-2 text-sm text-white/40">
          Current production state and incidents requiring attention.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewMetric
          icon={<AlertTriangle size={18} />}
          label="Active incidents"
          value={String(activeCount)}
          detail="Currently open"
        />

        <OverviewMetric
          icon={<AlertTriangle size={18} />}
          label="Critical"
          value={String(criticalIncidentCount)}
          detail="Immediate attention"
        />

        <OverviewMetric
          icon={<Activity size={18} />}
          label="Production state"
          value="Degraded"
          detail="2 services affected"
        />

        <OverviewMetric
          icon={<Clock3 size={18} />}
          label="Monitoring"
          value="Live"
          detail="Signals being processed"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SystemHealth />

        <ActiveIncidents
          incidents={incidents}
          onSelect={(incident) =>
            navigate(`/incidents/${incident.id}`)
          }
        />
      </div>

      <RecentEvents />
    </div>
  );
}

function OverviewMetric({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-lg border border-white/7 bg-white/3 p-2 text-white/45">
          {icon}
        </div>

        {label === "Production state" ? (
          <CircleCheck size={16} className="text-orange-400" />
        ) : null}
      </div>

      <p className="mt-5 text-xs uppercase tracking-wider text-white/30">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-white/30">
        {detail}
      </p>
    </div>
  );
}