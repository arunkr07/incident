export const APP_NAME = "Incident";

export const APP_DESCRIPTION =
  "AI-Powered Production Incident Response System";

export const NAVIGATION_PATHS = {
  overview: "/",
  incidents: "/incidents",
  services: "/services",
  logs: "/logs",
  metrics: "/metrics",
  deployments: "/deployments",
  settings: "/settings",
} as const;

export const INCIDENT_SEVERITIES = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
] as const;

export const INCIDENT_STATUSES = [
  "OPEN",
  "ACKNOWLEDGED",
  "INVESTIGATING",
  "MITIGATING",
  "RESOLVED",
] as const;

export const INCIDENT_SOURCES = [
  "AUTOMATIC",
  "MANUAL",
] as const;

export const SERVICE_STATUSES = [
  "HEALTHY",
  "DEGRADED",
  "DOWN",
] as const;

export const ENVIRONMENTS = [
  "production",
] as const;