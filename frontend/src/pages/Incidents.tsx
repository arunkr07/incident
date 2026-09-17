import { Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import IncidentTable from "../components/incidents/IncidentTable";
import { incidents } from "../data/incidentData";
import type {
  IncidentSeverity,
  IncidentStatus,
} from "../types/incident";

export default function Incidents() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState<
    IncidentSeverity | "ALL"
  >("ALL");
  const [status, setStatus] = useState<IncidentStatus | "ALL">(
    "ALL",
  );

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch =
        incident.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        incident.id
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        incident.service
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesSeverity =
        severity === "ALL" || incident.severity === severity;

      const matchesStatus =
        status === "ALL" || incident.status === status;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [search, severity, status]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">
          Operations
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Incidents
        </h1>

        <p className="mt-2 text-sm text-white/40">
          Production incidents detected and managed by the system.
        </p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search incidents, services or IDs..."
              className="h-10 w-full rounded-lg border border-white/8 bg-black/10 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-emerald-500/30"
            />
          </div>

          <div className="flex gap-3">
            <Select
              icon={<Filter size={14} />}
              value={severity}
              onChange={(value) =>
                setSeverity(
                  value as IncidentSeverity | "ALL",
                )
              }
              options={[
                "ALL",
                "CRITICAL",
                "HIGH",
                "MEDIUM",
                "LOW",
              ]}
            />

            <Select
              value={status}
              onChange={(value) =>
                setStatus(value as IncidentStatus | "ALL")
              }
              options={[
                "ALL",
                "DETECTED",
                "INVESTIGATING",
                "ACKNOWLEDGED",
                "MITIGATING",
                "RESOLVED",
              ]}
            />
          </div>
        </div>
      </div>

      <IncidentTable
        incidents={filteredIncidents}
        onSelect={(incident) =>
          navigate(`/incidents/${incident.id}`)
        }
      />
    </div>
  );
}

function Select({
  icon,
  value,
  onChange,
  options,
}: {
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
          {icon}
        </span>
      )}

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-10 appearance-none rounded-lg border border-white/8 bg-black/10 pr-9 text-xs text-white/60 outline-none focus:border-emerald-500/30 ${
          icon ? "pl-9" : "pl-3"
        }`}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#0b1813]"
          >
            {option.replace("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
}