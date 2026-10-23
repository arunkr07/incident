import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { MetricSeries } from "../types/operations";

export default function Metrics() {
  const [metrics, setMetrics] = useState<MetricSeries[]>([]);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let cancelled = false; api.getMetrics().then((data) => { if (!cancelled) { setMetrics(data); setSelectedMetric(data[0]?.name ?? ""); } }).catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load metrics."); }).finally(() => { if (!cancelled) setLoading(false); }); return () => { cancelled = true; }; }, []);
  const metric = metrics.find((item) => item.name === selectedMetric) ?? metrics[0];
  const max = metric ? Math.max(...metric.points.map((point) => point.value), 1) : 1;
  const coordinates = metric?.points.map((point, index) => `${metric.points.length === 1 ? 50 : (index / (metric.points.length - 1)) * 100},${100 - (point.value / max) * 85}`).join(" ") ?? "";
  return <div className="space-y-6"><header><p className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">Observability</p><h1 className="mt-2 text-2xl font-semibold text-white">Metrics</h1><p className="mt-2 text-sm text-white/40">Production metrics collected from monitored services.</p></header>
    {error && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">Could not load metrics: {error}</div>}
    {loading ? <p className="py-8 text-center text-sm text-white/35">Loading metrics…</p> : metrics.length === 0 ? <div className="rounded-2xl border border-white/8 bg-[#0b1813]/85 py-12 text-center text-sm text-white/35">{error ? "Metric data is unavailable until the API request succeeds." : "No metrics have been recorded yet."}</div> : <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{metrics.map((item) => <button key={item.name} onClick={() => setSelectedMetric(item.name)} className={`rounded-xl border p-4 text-left transition ${selectedMetric === item.name ? "border-emerald-500/25 bg-emerald-500/5" : "border-white/7 bg-[#0b1813]/85 hover:bg-white/3"}`}><p className="text-xs text-white/40">{item.name}</p><p className="mt-3 text-lg font-semibold text-white/80">{item.points.at(-1)?.value ?? "—"}<span className="ml-1 text-xs font-normal text-white/30">{item.unit}</span></p></button>)}</div>
      {metric && <section className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6"><div className="flex justify-between gap-4"><div><h2 className="text-sm font-semibold text-white">{metric.name}</h2><p className="mt-1 text-xs text-white/35">{metric.description}</p></div><p className="font-mono text-xs text-white/30">Backend records</p></div><div className="mt-8"><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-72 w-full">{[20,40,60,80].map((y) => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" className="text-white/5" strokeWidth="0.5"/>)}<polyline points={coordinates} fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>{metric.points.map((point,index) => <circle key={`${point.timestamp}-${index}`} cx={metric.points.length === 1 ? 50 : (index/(metric.points.length-1))*100} cy={100-(point.value/max)*85} r="1.6" className="fill-emerald-400"/>)}</svg><div className="mt-3 flex justify-between">{metric.points.map((point,index) => <span key={`${point.timestamp}-${index}`} className="font-mono text-[10px] text-white/25">{point.timestamp}</span>)}</div></div></section>}
    </>}
  </div>;
}
