import { useMemo, useState } from "react";

import LogDetails from "../components/logs/LogDetails";
import LogFilters from "../components/logs/LogFilters";
import LogTable from "../components/logs/LogTable";
import { logs, services } from "../data/operationsData";
import type {
  LogEntry,
  LogLevel,
} from "../types/operations";

export default function Logs() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<LogLevel | "ALL">("ALL");
  const [service, setService] = useState("ALL");
  const [selectedLog, setSelectedLog] =
    useState<LogEntry | null>(null);

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        log.message.toLowerCase().includes(query) ||
        log.service.toLowerCase().includes(query) ||
        log.traceId?.toLowerCase().includes(query) ||
        log.requestId?.toLowerCase().includes(query);

      const matchesLevel =
        level === "ALL" || log.level === level;

      const matchesService =
        service === "ALL" || log.service === service;

      return (
        matchesSearch &&
        matchesLevel &&
        matchesService
      );
    });
  }, [search, level, service]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">
          Observability
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-white">
          Logs
        </h1>

        <p className="mt-2 text-sm text-white/40">
          Search and inspect production logs emitted by monitored services.
        </p>
      </header>

      <LogFilters
        search={search}
        level={level}
        service={service}
        services={services.map((item) => item.name)}
        onSearchChange={setSearch}
        onLevelChange={setLevel}
        onServiceChange={setService}
      />

      <LogTable
        logs={filteredLogs}
        onSelect={setSelectedLog}
      />

      {selectedLog && (
        <LogDetails
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}