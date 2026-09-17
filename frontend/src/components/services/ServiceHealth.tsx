import {
  Activity,
  CheckCircle2,
  CircleAlert,
  CircleX,
} from "lucide-react";

import type { ServiceStatus } from "../../types/operations";

interface ServiceHealthProps {
  status: ServiceStatus;
}

export default function ServiceHealth({
  status,
}: ServiceHealthProps) {
  const config = {
    OPERATIONAL: {
      label: "Operational",
      icon: CheckCircle2,
      className:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    },
    DEGRADED: {
      label: "Degraded",
      icon: CircleAlert,
      className:
        "border-orange-500/20 bg-orange-500/10 text-orange-300",
    },
    DOWN: {
      label: "Down",
      icon: CircleX,
      className:
        "border-red-500/20 bg-red-500/10 text-red-300",
    },
    UNKNOWN: {
      label: "Unknown",
      icon: Activity,
      className:
        "border-white/10 bg-white/5 text-white/50",
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}