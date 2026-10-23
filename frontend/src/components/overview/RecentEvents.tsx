import { Activity, GitCommit, ShieldCheck } from "lucide-react";
import type { Incident } from "../../types/incident";
import type { Deployment } from "../../types/operations";

export default function RecentEvents({ incidents, deployments }: { incidents: Incident[]; deployments: Deployment[] }) {
  const events = [
    ...incidents.map((incident) => ({ key: `i-${incident.id}`, title: `${incident.title} · ${incident.status.toLowerCase()}`, time: incident.startedAt, icon: Activity, order: incident.startedAt })),
    ...deployments.map((deployment) => ({ key: `d-${deployment.id}`, title: `${deployment.service} ${deployment.version} · ${deployment.status.toLowerCase()}`, time: deployment.deployedAt, icon: GitCommit, order: deployment.deployedAt })),
  ].slice(0, 6);
  return <section className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6"><p className="text-sm font-semibold text-white">Recent production events</p><p className="mt-1 text-xs text-white/35">Latest events available from the backend.</p><div className="mt-5 space-y-4">{events.map((event) => { const Icon = event.icon; return <div key={event.key} className="flex items-center gap-3"><div className="rounded-lg border border-white/7 bg-white/3 p-2 text-white/40"><Icon size={15} /></div><p className="flex-1 text-sm text-white/55">{event.title}</p><span className="font-mono text-[11px] text-white/25">{event.time}</span></div>; })}{events.length === 0 && <div className="flex items-center gap-3 py-6 text-sm text-white/35"><ShieldCheck size={16} />No incidents or deployments have been recorded.</div>}</div></section>;
}
