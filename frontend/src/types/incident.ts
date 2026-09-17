export type IncidentSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type IncidentStatus =
  | "DETECTED"
  | "INVESTIGATING"
  | "ACKNOWLEDGED"
  | "MITIGATING"
  | "RESOLVED";

export type IncidentSource =
  | "AUTOMATED_DETECTION"
  | "DEPLOYMENT"
  | "HEALTH_CHECK"
  | "MANUAL";

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  source: IncidentSource;
  startedAt: string;
  duration: string;
  description: string;
  affectedUsers?: string;
  errorRate?: string;
  latency?: string;
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  type:
    | "DETECTED"
    | "ALERT"
    | "DEPLOYMENT"
    | "INVESTIGATION"
    | "REMEDIATION"
    | "RESOLVED";
  title: string;
  description: string;
  actor: "SYSTEM" | "MANAGER" | "AI";
}

export interface IncidentMetricPoint {
  time: string;
  value: number;
}

export interface IncidentLog {
  id: string;
  timestamp: string;
  level: "ERROR" | "WARN" | "INFO";
  service: string;
  message: string;
  traceId?: string;
}

export interface IncidentInvestigation {
  incident: Incident;
  timeline: IncidentTimelineEvent[];
  metrics: {
    errorRate: IncidentMetricPoint[];
    latency: IncidentMetricPoint[];
  };
  logs: IncidentLog[];
  rootCause?: string;
  confidence?: number;
  evidence?: string[];
  recommendation?: string;
}