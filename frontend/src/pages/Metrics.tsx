import { useState } from "react";

import { metrics } from "../data/operationsData";

export default function Metrics() {
  const [selectedMetric, setSelectedMetric] =
    useState(metrics[1].name);

  const metric =
    metrics.find((item) => item.name === selectedMetric) ??
    metrics[0];

  const max = Math.max(
    ...metric.points.map((point) => point.value),
    1,
  );

  const coordinates = metric.points
    .map((point, index) => {
      const x =
        (index / (metric.points.length - 1)) * 100;

      const y = 100 - (point.value / max) * 85;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">
          Observability
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-white">
          Metrics
        </h1>

        <p className="mt-2 text-sm text-white/40">
          Production metrics collected from monitored services.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item) => (
          <button
            key={item.name}
            onClick={() => setSelectedMetric(item.name)}
            className={`rounded-xl border p-4 text-left transition ${
              selectedMetric === item.name
                ? "border-emerald-500/25 bg-emerald-500/5"
                : "border-white/7 bg-[#0b1813]/85 hover:bg-white/3"
            }`}
          >
            <p className="text-xs text-white/40">
              {item.name}
            </p>

            <p className="mt-3 text-lg font-semibold text-white/80">
              {item.points[item.points.length - 1].value}
              <span className="ml-1 text-xs font-normal text-white/30">
                {item.unit}
              </span>
            </p>
          </button>
        ))}
      </div>

      <section className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6">
        <div className="flex justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-white">
              {metric.name}
            </h2>

            <p className="mt-1 text-xs text-white/35">
              {metric.description}
            </p>
          </div>

          <p className="font-mono text-xs text-white/30">
            Production
          </p>
        </div>

        <div className="mt-8">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-72 w-full"
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

            {metric.points.map((point, index) => {
              const x =
                (index / (metric.points.length - 1)) * 100;

              const y = 100 - (point.value / max) * 85;

              return (
                <circle
                  key={point.timestamp}
                  cx={x}
                  cy={y}
                  r="1.6"
                  className="fill-emerald-400"
                />
              );
            })}
          </svg>

          <div className="mt-3 flex justify-between">
            {metric.points.map((point) => (
              <span
                key={point.timestamp}
                className="font-mono text-[10px] text-white/25"
              >
                {point.timestamp}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}