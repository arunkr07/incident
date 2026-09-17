import type {
  IncidentSeverity,
  IncidentStatus,
} from "../../types/incident";

interface IncidentStatusProps {
  severity?: IncidentSeverity;
  status?: IncidentStatus;
}

export default function IncidentStatus({
  severity,
  status,
}: IncidentStatusProps) {
  if (severity) {
    const severityStyles: Record<IncidentSeverity, string> = {
      CRITICAL:
        "border-red-500/30 bg-red-500/10 text-red-300",
      HIGH:
        "border-orange-500/30 bg-orange-500/10 text-orange-300",
      MEDIUM:
        "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
      LOW:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    };

    return (
      <span
        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${severityStyles[severity]}`}
      >
        {severity}
      </span>
    );
  }

  if (status) {
    const statusStyles: Record<IncidentStatus, string> = {
      DETECTED:
        "border-red-500/30 bg-red-500/10 text-red-300",
      INVESTIGATING:
        "border-purple-500/30 bg-purple-500/10 text-purple-300",
      ACKNOWLEDGED:
        "border-blue-500/30 bg-blue-500/10 text-blue-300",
      MITIGATING:
        "border-orange-500/30 bg-orange-500/10 text-orange-300",
      RESOLVED:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    };

    return (
      <span
        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  }

  return null;
}