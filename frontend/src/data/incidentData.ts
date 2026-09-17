import type {
  Incident,
  IncidentInvestigation,
} from "../types/incident";

export const incidents: Incident[] = [
  {
    id: "INC-2026-0916-001",
    title: "Payment API elevated error rate",
    service: "payment-service",
    severity: "CRITICAL",
    status: "INVESTIGATING",
    source: "AUTOMATED_DETECTION",
    startedAt: "07:18",
    duration: "13m",
    description:
      "The payment service is returning an elevated number of 5xx responses.",
    affectedUsers: "18.4%",
    errorRate: "12.8%",
    latency: "1.82s",
  },
  {
    id: "INC-2026-0916-002",
    title: "Order service latency degradation",
    service: "order-service",
    severity: "HIGH",
    status: "ACKNOWLEDGED",
    source: "AUTOMATED_DETECTION",
    startedAt: "06:54",
    duration: "37m",
    description:
      "Order creation latency has exceeded the configured production threshold.",
    affectedUsers: "7.2%",
    errorRate: "3.4%",
    latency: "940ms",
  },
  {
    id: "INC-2026-0915-019",
    title: "Authentication service intermittent failures",
    service: "auth-service",
    severity: "MEDIUM",
    status: "MITIGATING",
    source: "HEALTH_CHECK",
    startedAt: "23:41",
    duration: "42m",
    description:
      "Authentication requests intermittently fail during token validation.",
    affectedUsers: "2.1%",
    errorRate: "1.9%",
    latency: "420ms",
  },
  {
    id: "INC-2026-0915-017",
    title: "Notification worker backlog",
    service: "notification-worker",
    severity: "LOW",
    status: "RESOLVED",
    source: "AUTOMATED_DETECTION",
    startedAt: "21:12",
    duration: "19m",
    description:
      "Notification queue depth exceeded the configured warning threshold.",
    affectedUsers: "0.4%",
    errorRate: "0.2%",
    latency: "180ms",
  },
];

export const activeIncidentCount = incidents.filter(
  (incident) => incident.status !== "RESOLVED",
).length;

export const criticalIncidentCount = incidents.filter(
  (incident) =>
    incident.severity === "CRITICAL" &&
    incident.status !== "RESOLVED",
).length;

export const investigationData: IncidentInvestigation = {
  incident: incidents[0],

  timeline: [
    {
      id: "evt-1",
      timestamp: "07:18:04",
      type: "DETECTED",
      title: "Incident automatically detected",
      description:
        "Payment API error rate crossed the configured critical threshold.",
      actor: "SYSTEM",
    },
    {
      id: "evt-2",
      timestamp: "07:18:09",
      type: "ALERT",
      title: "Critical production alert created",
      description:
        "Detection engine created INC-2026-0916-001.",
      actor: "SYSTEM",
    },
    {
      id: "evt-3",
      timestamp: "07:19:31",
      type: "INVESTIGATION",
      title: "Investigation started",
      description:
        "Incident context collection started for payment-service.",
      actor: "AI",
    },
    {
      id: "evt-4",
      timestamp: "07:21:17",
      type: "DEPLOYMENT",
      title: "Recent deployment identified",
      description:
        "payment-service version 2.8.4 was deployed 11 minutes before the incident.",
      actor: "SYSTEM",
    },
    {
      id: "evt-5",
      timestamp: "07:24:42",
      type: "INVESTIGATION",
      title: "Evidence correlation completed",
      description:
        "Error spikes correlate with the latest payment-service deployment.",
      actor: "AI",
    },
  ],

  metrics: {
    errorRate: [
      { time: "07:05", value: 1.2 },
      { time: "07:10", value: 1.4 },
      { time: "07:15", value: 2.1 },
      { time: "07:20", value: 8.4 },
      { time: "07:25", value: 12.8 },
      { time: "07:30", value: 11.9 },
    ],

    latency: [
      { time: "07:05", value: 240 },
      { time: "07:10", value: 270 },
      { time: "07:15", value: 310 },
      { time: "07:20", value: 720 },
      { time: "07:25", value: 1820 },
      { time: "07:30", value: 1640 },
    ],
  },

  logs: [
    {
      id: "log-1",
      timestamp: "07:25:14.218",
      level: "ERROR",
      service: "payment-service",
      message:
        "Payment provider request failed: upstream timeout after 3000ms",
      traceId: "tr_9f821a",
    },
    {
      id: "log-2",
      timestamp: "07:25:15.009",
      level: "ERROR",
      service: "payment-service",
      message:
        "Failed to process payment transaction after upstream timeout",
      traceId: "tr_9f821b",
    },
    {
      id: "log-3",
      timestamp: "07:25:16.421",
      level: "WARN",
      service: "payment-service",
      message:
        "Retry threshold reached for payment-provider connection",
      traceId: "tr_9f821c",
    },
    {
      id: "log-4",
      timestamp: "07:25:18.201",
      level: "INFO",
      service: "payment-service",
      message:
        "Circuit breaker state changed from CLOSED to OPEN",
      traceId: "tr_9f821d",
    },
  ],

  rootCause:
    "The payment-service deployment introduced an upstream payment-provider timeout condition. The resulting retry amplification caused elevated request latency and 5xx responses.",

  confidence: 87,

  evidence: [
    "Error rate increased approximately 11 minutes after deployment v2.8.4.",
    "Payment-provider timeout errors increased at the same time as 5xx responses.",
    "Circuit breaker transitioned to OPEN after repeated upstream failures.",
    "No equivalent increase was detected in unrelated production services.",
  ],

  recommendation:
    "Rollback payment-service from v2.8.4 to the previous production version and monitor payment-provider error rate and request latency during recovery.",
};