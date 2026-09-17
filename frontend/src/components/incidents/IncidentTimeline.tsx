import {
  Bot,
  CheckCircle2,
  CircleAlert,
  GitCommitHorizontal,
  Search,
  Zap,
} from "lucide-react";
import type { IncidentTimelineEvent } from "../../types/incident";

interface IncidentTimelineProps {
  events: IncidentTimelineEvent[];
}

export default function IncidentTimeline({
  events,
}: IncidentTimelineProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0b1813]/85 p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold text-white">
          Incident timeline
        </p>
        <p className="mt-1 text-xs text-white/40">
          System and investigation events associated with this incident.
        </p>
      </div>

      <div className="relative">
        <div className="absolute bottom-3 left-3.75 top-3 w-px bg-white/8" />

        <div className="space-y-7">
          {events.map((event) => (
            <div key={event.id} className="relative flex gap-4">
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0b1813] text-white/55">
                <EventIcon type={event.type} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-white/80">
                    {event.title}
                  </p>

                  <span className="font-mono text-[11px] text-white/30">
                    {event.timestamp}
                  </span>
                </div>

                <p className="mt-1 text-sm leading-6 text-white/45">
                  {event.description}
                </p>

                <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-white/25">
                  {event.actor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventIcon({
  type,
}: {
  type: IncidentTimelineEvent["type"];
}) {
  switch (type) {
    case "DETECTED":
      return <CircleAlert size={15} />;

    case "ALERT":
      return <Zap size={15} />;

    case "DEPLOYMENT":
      return <GitCommitHorizontal size={15} />;

    case "INVESTIGATION":
      return <Search size={15} />;

    case "REMEDIATION":
      return <Bot size={15} />;

    case "RESOLVED":
      return <CheckCircle2 size={15} />;
  }
}