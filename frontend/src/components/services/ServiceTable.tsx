import { ChevronRight } from "lucide-react";

import type { Service } from "../../types/operations";
import ServiceHealth from "./ServiceHealth";

interface ServiceTableProps {
  services: Service[];
  onSelect: (service: Service) => void;
}

export default function ServiceTable({
  services,
  onSelect,
}: ServiceTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0b1813]/85">
      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5 text-left">
          <thead className="border-b border-white/8 bg-white/2">
            <tr className="text-xs uppercase tracking-wider text-white/35">
              <th className="px-5 py-4">Service</th>
              <th className="px-5 py-4">Health</th>
              <th className="px-5 py-4">Version</th>
              <th className="px-5 py-4">Error rate</th>
              <th className="px-5 py-4">Latency</th>
              <th className="px-5 py-4">Requests</th>
              <th />
            </tr>
          </thead>

          <tbody className="divide-y divide-white/6">
            {services.map((service) => (
              <tr
                key={service.id}
                onClick={() => onSelect(service)}
                className="group cursor-pointer transition hover:bg-white/2.5"
              >
                <td className="px-5 py-4">
                  <p className="font-mono text-sm text-white/75">
                    {service.name}
                  </p>

                  <p className="mt-1 max-w-xs truncate text-xs text-white/30">
                    {service.description}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <ServiceHealth status={service.status} />
                </td>

                <td className="px-5 py-4 font-mono text-xs text-white/45">
                  {service.version}
                </td>

                <td
                  className={`px-5 py-4 font-mono text-xs ${
                    service.status === "DEGRADED"
                      ? "text-orange-300"
                      : "text-white/45"
                  }`}
                >
                  {service.errorRate}
                </td>

                <td className="px-5 py-4 font-mono text-xs text-white/45">
                  {service.latency}
                </td>

                <td className="px-5 py-4 font-mono text-xs text-white/45">
                  {service.requestsPerSecond} req/s
                </td>

                <td className="px-5 py-4">
                  <ChevronRight
                    size={16}
                    className="text-white/20 transition group-hover:translate-x-1 group-hover:text-emerald-400"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}