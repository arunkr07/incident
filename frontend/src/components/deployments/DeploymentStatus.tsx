import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";

import type { DeploymentStatus as Status } from "../../types/operations";

export default function DeploymentStatus({
  status,
}: {
  status: Status;
}) {
  const config = {
    SUCCESS: {
      label: "Success",
      icon: CheckCircle2,
      className: "text-emerald-400",
    },
    IN_PROGRESS: {
      label: "In progress",
      icon: LoaderCircle,
      className: "text-blue-400",
    },
    FAILED: {
      label: "Failed",
      icon: CircleAlert,
      className: "text-red-400",
    },
    ROLLED_BACK: {
      label: "Rolled back",
      icon: RotateCcw,
      className: "text-orange-400",
    },
  }[status];

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${config.className}`}>
      <Icon size={14} />
      {config.label}
    </span>
  );
}