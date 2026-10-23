export type ServiceStatus = "OPERATIONAL" | "DEGRADED" | "DOWN" | "UNKNOWN";
export type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG" | "FATAL";
export type DeploymentStatus = "SUCCESS" | "IN_PROGRESS" | "FAILED" | "ROLLED_BACK";

export interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
  version?: string;
  uptime?: string;
  errorRate?: string;
  latency?: string;
  requestsPerSecond?: number;
  description: string;
  environment?: string;
  endpoint?: string;
}
export interface ServiceDependency {
  source: string;
  target: string;
  type: "HTTP" | "DATABASE" | "QUEUE" | "CACHE" | string;
  status: "HEALTHY" | "DEGRADED" | "FAILED" | "UNKNOWN";
  latency?: string;
}
export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  environment: string;
  message: string;
  traceId?: string;
  requestId?: string;
}
export interface MetricSeries {
  name: string;
  unit: string;
  description: string;
  points: { timestamp: string; value: number }[];
}
export interface Deployment {
  id: string;
  service: string;
  version: string;
  previousVersion: string;
  status: DeploymentStatus;
  deployedAt: string;
  deployedBy: string;
  commit: string;
  branch: string;
  changeSummary: string;
  incidentIds: string[];
}
