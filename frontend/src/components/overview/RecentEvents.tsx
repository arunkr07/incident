import {
  Activity,
  GitCommit,
  ShieldCheck,
} from "lucide-react";

const events = [
  {
    icon: Activity,
    title: "payment-service entered degraded state",
    time: "07:18",
  },
  {
    icon: GitCommit,
    title: "payment-service v2.8.4 deployed",
    time: "07:07",
  },
  {
    icon: ShieldCheck,
    title: "notification-worker recovered",
    time: "06:51",
  },
];

export default function RecentEvents() {
  return (
    <section className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6">
      <p className="text-sm font-semibold text-white">
        Recent production events
      </p>

      <p className="mt-1 text-xs text-white/35">
        Latest events emitted by the production system.
      </p>

      <div className="mt-5 space-y-4">
        {events.map((event) => {
          const Icon = event.icon;

          return (
            <div
              key={event.title}
              className="flex items-center gap-3"
            >
              <div className="rounded-lg border border-white/7 bg-white/3 p-2 text-white/40">
                <Icon size={15} />
              </div>

              <p className="flex-1 text-sm text-white/55">
                {event.title}
              </p>

              <span className="font-mono text-[11px] text-white/25">
                {event.time}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}