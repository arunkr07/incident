import type { IncidentMetricPoint } from "../../types/incident";

interface IncidentMetricsProps {
  errorRate: IncidentMetricPoint[];
  latency: IncidentMetricPoint[];
}

export default function IncidentMetrics({
  errorRate,
  latency,
}: IncidentMetricsProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <MetricChart
        title="Error rate"
        unit="%"
        points={errorRate}
      />

      <MetricChart
        title="Latency"
        unit="ms"
        points={latency}
      />
    </div>
  );
}

function MetricChart({
  title,
  unit,
  points,
}: {
  title: string;
  unit: string;
  points: IncidentMetricPoint[];
}) {
  const max = Math.max(...points.map((point) => point.value), 1);

  const coordinates = points
    .map((point, index) => {
      const x =
        points.length === 1
          ? 50
          : (index / (points.length - 1)) * 100;

      const y = 100 - (point.value / max) * 82;

      return `${x},${y}`;
    })
    .join(" ");

  const latest = points[points.length - 1];

  return (
    <div className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            {title}
          </p>

          <p className="mt-1 text-xs text-white/35">
            Incident window
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold text-white">
            {latest.value}
            <span className="ml-1 text-xs font-normal text-white/35">
              {unit}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-48 w-full overflow-visible"
        >
          {[20, 40, 60, 80].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="currentColor"
              className="text-white/5"
              strokeWidth="0.5"
            />
          ))}

          <polyline
            points={coordinates}
            fill="none"
            stroke="currentColor"
            className="text-emerald-400"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {points.map((point, index) => {
            const x =
              points.length === 1
                ? 50
                : (index / (points.length - 1)) * 100;

            const y = 100 - (point.value / max) * 82;

            return (
              <circle
                key={`${point.time}-${index}`}
                cx={x}
                cy={y}
                r="1.5"
                className="fill-emerald-400"
              />
            );
          })}
        </svg>

        <div className="mt-2 flex justify-between">
          {points.map((point) => (
            <span
              key={point.time}
              className="font-mono text-[10px] text-white/25"
            >
              {point.time}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}