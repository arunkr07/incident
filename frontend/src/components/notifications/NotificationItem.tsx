import { Activity, BrainCircuit, GitBranch, ShieldAlert, TriangleAlert } from "lucide-react";
import type { Notification } from "../../types/notifications";

interface Props { notification: Notification; onMarkRead?: () => void; }
const icons = { INCIDENT: ShieldAlert, CRITICAL: TriangleAlert, AI: BrainCircuit, SERVICE: Activity, DEPLOYMENT: GitBranch, RECOVERY: Activity };

export default function NotificationItem({ notification, onMarkRead }: Props) {
  const Icon = icons[notification.type] ?? BellFallback;
  return (
    <button type="button" onClick={() => { if (!notification.read) onMarkRead?.(); }} disabled={notification.read || !onMarkRead}
      className={`w-full rounded-xl border p-4 text-left transition ${notification.read ? "border-white/5 bg-white/1 cursor-default" : "border-emerald-400/10 bg-emerald-400/2.5 hover:bg-emerald-400/5"}`}>
      <div className="flex gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-white/2.5 text-emerald-300"><Icon size={15} /></div>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-3"><p className="text-xs font-medium text-white/70">{notification.title}</p><span className="shrink-0 text-[9px] text-white/20">{notification.timestamp}</span></div>
          <p className="mt-1 text-[11px] leading-5 text-white/30">{notification.description}</p>
          {!notification.read && <span className="mt-2 inline-block text-[9px] text-emerald-300/60">Mark read</span>}
        </div>
      </div>
    </button>
  );
}
function BellFallback() { return <Activity size={15} />; }
