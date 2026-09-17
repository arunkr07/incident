import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ServiceTable from "../components/services/ServiceTable";
import { services } from "../data/operationsData";

export default function Services() {
  const navigate = useNavigate();

  const degraded = services.filter(
    (service) => service.status === "DEGRADED",
  ).length;

  const operational = services.filter(
    (service) => service.status === "OPERATIONAL",
  ).length;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">
          Infrastructure
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-white">
          Services
        </h1>

        <p className="mt-2 text-sm text-white/40">
          Monitored production services and their current operational state.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Summary label="Total services" value={services.length} />
        <Summary label="Operational" value={operational} />
        <Summary label="Degraded" value={degraded} />
      </div>

      <div className="flex items-center gap-2 text-xs text-white/35">
        <Activity size={14} className="text-emerald-400" />
        Monitoring production service health
      </div>

      <ServiceTable
        services={services}
        onSelect={(service) =>
          navigate(`/services/${service.id}`)
        }
      />
    </div>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-5">
      <p className="text-xs uppercase tracking-wider text-white/30">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}