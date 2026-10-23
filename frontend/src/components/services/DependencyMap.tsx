import {
  ArrowRight,
  Database,
  Globe,
  MessageSquare,
  Server,
  Zap,
} from "lucide-react";

import type {
  ServiceDependency,
} from "../../types/operations";

interface DependencyMapProps {
  dependencies: ServiceDependency[];
}

export default function DependencyMap({
  dependencies,
}: DependencyMapProps) {
  return (
    <section className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6">
      <div>
        <p className="text-sm font-semibold text-white">
          Service dependencies
        </p>

        <p className="mt-1 text-xs text-white/35">
          Current service-to-service relationships and dependency health.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {dependencies.map((dependency, index) => (
          <div
            key={`${dependency.source}-${dependency.target}-${index}`}
            className="flex flex-col gap-3 rounded-xl border border-white/6 bg-white/2 p-4 sm:flex-row sm:items-center"
          >
            <ServiceNode
              name={dependency.source}
              healthy={dependency.status === "HEALTHY"}
            />

            <div className="flex items-center gap-2 text-white/20">
              <ArrowRight size={17} />
              <span className="hidden font-mono text-[10px] uppercase sm:inline">
                {dependency.type}
              </span>
            </div>

            <ServiceNode
              name={dependency.target}
              healthy={dependency.status === "HEALTHY"}
            />

            <div className="sm:ml-auto">
              <span
                className={`text-xs ${
                  dependency.status === "HEALTHY"
                    ? "text-emerald-400"
                    : dependency.status === "DEGRADED"
                      ? "text-orange-400"
                      : dependency.status === "UNKNOWN"
                        ? "text-white/35"
                        : "text-red-400"
                }`}
              >
                {dependency.status === "UNKNOWN" ? "Health not reported" : dependency.status}
              </span>

              {dependency.latency && (
                <span className="ml-3 font-mono text-xs text-white/30">
                  {dependency.latency}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServiceNode({
  name,
  healthy,
}: {
  name: string;
  healthy: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className={`rounded-lg border p-2 ${
          healthy
            ? "border-emerald-500/15 bg-emerald-500/5 text-emerald-400"
            : "border-orange-500/15 bg-orange-500/5 text-orange-400"
        }`}
      >
        <NodeIcon name={name} />
      </div>

      <span className="truncate font-mono text-xs text-white/65">
        {name}
      </span>
    </div>
  );
}

function NodeIcon({ name }: { name: string }) {
  if (name.includes("gateway")) {
    return <Globe size={15} />;
  }

  if (name.includes("worker")) {
    return <MessageSquare size={15} />;
  }

  if (name.includes("payment")) {
    return <Zap size={15} />;
  }

  if (name.includes("database")) {
    return <Database size={15} />;
  }

  return <Server size={15} />;
}