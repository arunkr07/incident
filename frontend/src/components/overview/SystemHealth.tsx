import {
  Activity,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";

const services = [
  {
    name: "payment-service",
    status: "Degraded",
    latency: "1.82s",
    healthy: false,
  },
  {
    name: "order-service",
    status: "Degraded",
    latency: "940ms",
    healthy: false,
  },
  {
    name: "auth-service",
    status: "Operational",
    latency: "210ms",
    healthy: true,
  },
  {
    name: "notification-worker",
    status: "Operational",
    latency: "180ms",
    healthy: true,
  },
];

export default function SystemHealth() {
  return (
    <section className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Production health
          </p>

          <p className="mt-1 text-xs text-white/35">
            Current state across monitored services.
          </p>
        </div>

        <Activity size={18} className="text-emerald-400" />
      </div>

      <div className="mt-5 space-y-2">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/2 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              {service.healthy ? (
                <CheckCircle2
                  size={16}
                  className="text-emerald-400"
                />
              ) : (
                <CircleAlert
                  size={16}
                  className="text-orange-400"
                />
              )}

              <div>
                <p className="font-mono text-xs text-white/70">
                  {service.name}
                </p>

                <p className="mt-1 text-[11px] text-white/30">
                  {service.status}
                </p>
              </div>
            </div>

            <span className="font-mono text-xs text-white/35">
              {service.latency}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}