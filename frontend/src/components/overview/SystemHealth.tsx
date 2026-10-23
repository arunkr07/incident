import { Activity, CheckCircle2, CircleAlert } from "lucide-react";
import type { Service } from "../../types/operations";

export default function SystemHealth({ services }: { services: Service[] }) {
  return <section className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6">
    <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-white">Production health</p><p className="mt-1 text-xs text-white/35">Current state across monitored services.</p></div><Activity size={18} className="text-emerald-400" /></div>
    <div className="mt-5 space-y-2">
      {services.map((service) => { const healthy = service.status === "OPERATIONAL"; return <div key={service.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/2 px-4 py-3"><div className="flex items-center gap-3">{healthy ? <CheckCircle2 size={16} className="text-emerald-400" /> : <CircleAlert size={16} className="text-orange-400" />}<div><p className="font-mono text-xs text-white/70">{service.name}</p><p className="mt-1 text-[11px] text-white/30">{service.status === "OPERATIONAL" ? "Healthy" : service.status === "UNKNOWN" ? "Unknown" : service.status === "DOWN" ? "Down" : "Degraded"}</p></div></div><span className="font-mono text-xs text-white/35">{service.latency ?? "—"}</span></div>; })}
      {services.length === 0 && <p className="py-8 text-center text-sm text-white/35">No services have been registered yet.</p>}
    </div>
  </section>;
}
