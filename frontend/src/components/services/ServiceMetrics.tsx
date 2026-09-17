import type { Service } from "../../types/operations";

interface ServiceMetricsProps {
  service: Service;
}

export default function ServiceMetrics({
  service,
}: ServiceMetricsProps) {
  const metrics = [
    {
      label: "Error rate",
      value: service.errorRate,
    },
    {
      label: "Latency",
      value: service.latency,
    },
    {
      label: "Requests",
      value: `${service.requestsPerSecond} req/s`,
    },
    {
      label: "Uptime",
      value: service.uptime,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-xl border border-white/7 bg-white/2 p-4"
        >
          <p className="text-xs uppercase tracking-wider text-white/30">
            {metric.label}
          </p>

          <p className="mt-3 text-lg font-semibold text-white/80">
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}