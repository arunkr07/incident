import { Terminal } from "lucide-react";
import type { IncidentLog } from "../../types/incident";

interface IncidentLogsProps {
  logs: IncidentLog[];
}

export default function IncidentLogs({
  logs,
}: IncidentLogsProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#07100c]">
      <div className="flex items-center gap-2 border-b border-white/8 px-5 py-4">
        <Terminal size={16} className="text-emerald-400" />

        <div>
          <p className="text-sm font-semibold text-white">
            Relevant logs
          </p>

          <p className="text-xs text-white/35">
            Logs correlated with this incident.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5 text-left font-mono">
          <thead className="border-b border-white/6">
            <tr className="text-[10px] uppercase tracking-wider text-white/25">
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-5 py-3">Level</th>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Message</th>
              <th className="px-5 py-3">Trace</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-white/2">
                <td className="px-5 py-4 text-xs text-white/30">
                  {log.timestamp}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={
                      log.level === "ERROR"
                        ? "text-red-400"
                        : log.level === "WARN"
                          ? "text-orange-400"
                          : "text-emerald-400"
                    }
                  >
                    {log.level}
                  </span>
                </td>

                <td className="px-5 py-4 text-xs text-white/45">
                  {log.service}
                </td>

                <td className="max-w-xl px-5 py-4 text-xs leading-5 text-white/65">
                  {log.message}
                </td>

                <td className="px-5 py-4 text-xs text-white/25">
                  {log.traceId ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}