import type {
  Deployment,
  LogEntry,
  MetricSeries,
  Service,
  ServiceDependency,
} from "../types/operations";

export const services: Service[] = [
  {
    id: "payment-service",
    name: "payment-service",
    status: "DEGRADED",
    version: "v2.8.4",
    uptime: "99.91%",
    errorRate: "12.8%",
    latency: "1.82s",
    requestsPerSecond: 142,
    description:
      "Handles payment authorization, capture and provider communication.",
  },
  {
    id: "order-service",
    name: "order-service",
    status: "DEGRADED",
    version: "v3.4.1",
    uptime: "99.94%",
    errorRate: "3.4%",
    latency: "940ms",
    requestsPerSecond: 218,
    description:
      "Handles order creation, updates and order lifecycle operations.",
  },
  {
    id: "auth-service",
    name: "auth-service",
    status: "OPERATIONAL",
    version: "v4.1.0",
    uptime: "99.99%",
    errorRate: "0.2%",
    latency: "210ms",
    requestsPerSecond: 391,
    description:
      "Provides authentication and token validation services.",
  },
  {
    id: "notification-worker",
    name: "notification-worker",
    status: "OPERATIONAL",
    version: "v1.9.2",
    uptime: "99.97%",
    errorRate: "0.2%",
    latency: "180ms",
    requestsPerSecond: 74,
    description:
      "Processes asynchronous email, SMS and notification jobs.",
  },
  {
    id: "api-gateway",
    name: "api-gateway",
    status: "OPERATIONAL",
    version: "v5.2.0",
    uptime: "99.99%",
    errorRate: "0.1%",
    latency: "95ms",
    requestsPerSecond: 742,
    description:
      "Entry point for external client traffic and API routing.",
  },
];

export const dependencies: ServiceDependency[] = [
  {
    source: "api-gateway",
    target: "auth-service",
    type: "HTTP",
    status: "HEALTHY",
    latency: "45ms",
  },
  {
    source: "api-gateway",
    target: "order-service",
    type: "HTTP",
    status: "DEGRADED",
    latency: "940ms",
  },
  {
    source: "api-gateway",
    target: "payment-service",
    type: "HTTP",
    status: "DEGRADED",
    latency: "1.82s",
  },
  {
    source: "order-service",
    target: "payment-service",
    type: "HTTP",
    status: "DEGRADED",
    latency: "1.21s",
  },
  {
    source: "order-service",
    target: "notification-worker",
    type: "QUEUE",
    status: "HEALTHY",
  },
];

export const logs: LogEntry[] = [
  {
    id: "log-001",
    timestamp: "07:31:14.218",
    level: "ERROR",
    service: "payment-service",
    environment: "production",
    message:
      "Payment provider request failed: upstream timeout after 3000ms",
    traceId: "tr_9f821a",
    requestId: "req_72191",
  },
  {
    id: "log-002",
    timestamp: "07:31:14.509",
    level: "ERROR",
    service: "payment-service",
    environment: "production",
    message:
      "Failed to process payment transaction after upstream timeout",
    traceId: "tr_9f821b",
    requestId: "req_72192",
  },
  {
    id: "log-003",
    timestamp: "07:31:15.102",
    level: "WARN",
    service: "payment-service",
    environment: "production",
    message:
      "Retry threshold reached for payment-provider connection",
    traceId: "tr_9f821c",
    requestId: "req_72193",
  },
  {
    id: "log-004",
    timestamp: "07:31:16.201",
    level: "INFO",
    service: "payment-service",
    environment: "production",
    message:
      "Circuit breaker state changed from CLOSED to OPEN",
    traceId: "tr_9f821d",
    requestId: "req_72194",
  },
  {
    id: "log-005",
    timestamp: "07:31:17.832",
    level: "ERROR",
    service: "order-service",
    environment: "production",
    message:
      "Payment dependency returned HTTP 504",
    traceId: "tr_9f821e",
    requestId: "req_72195",
  },
  {
    id: "log-006",
    timestamp: "07:31:18.212",
    level: "INFO",
    service: "auth-service",
    environment: "production",
    message:
      "Successfully validated authentication token",
    traceId: "tr_9f821f",
    requestId: "req_72196",
  },
];

export const metrics: MetricSeries[] = [
  {
    name: "Request rate",
    unit: "req/s",
    description: "Incoming requests per second.",
    points: [
      { timestamp: "07:00", value: 510 },
      { timestamp: "07:05", value: 542 },
      { timestamp: "07:10", value: 581 },
      { timestamp: "07:15", value: 612 },
      { timestamp: "07:20", value: 742 },
      { timestamp: "07:25", value: 731 },
      { timestamp: "07:30", value: 718 },
    ],
  },
  {
    name: "Error rate",
    unit: "%",
    description: "Percentage of requests returning errors.",
    points: [
      { timestamp: "07:00", value: 0.8 },
      { timestamp: "07:05", value: 1.1 },
      { timestamp: "07:10", value: 1.3 },
      { timestamp: "07:15", value: 2.1 },
      { timestamp: "07:20", value: 8.4 },
      { timestamp: "07:25", value: 12.8 },
      { timestamp: "07:30", value: 11.9 },
    ],
  },
  {
    name: "Latency",
    unit: "ms",
    description: "Average request latency.",
    points: [
      { timestamp: "07:00", value: 220 },
      { timestamp: "07:05", value: 240 },
      { timestamp: "07:10", value: 270 },
      { timestamp: "07:15", value: 310 },
      { timestamp: "07:20", value: 720 },
      { timestamp: "07:25", value: 1820 },
      { timestamp: "07:30", value: 1640 },
    ],
  },
  {
    name: "CPU usage",
    unit: "%",
    description: "Current CPU utilization.",
    points: [
      { timestamp: "07:00", value: 41 },
      { timestamp: "07:05", value: 43 },
      { timestamp: "07:10", value: 47 },
      { timestamp: "07:15", value: 49 },
      { timestamp: "07:20", value: 55 },
      { timestamp: "07:25", value: 61 },
      { timestamp: "07:30", value: 59 },
    ],
  },
];

export const deployments: Deployment[] = [
  {
    id: "DEP-2026-0916-004",
    service: "payment-service",
    version: "v2.8.4",
    previousVersion: "v2.8.3",
    status: "SUCCESS",
    deployedAt: "07:07",
    deployedBy: "CI/CD",
    commit: "8f91c2a",
    branch: "main",
    changeSummary:
      "Updated payment provider integration timeout and retry handling.",
    incidentIds: ["INC-2026-0916-001"],
  },
  {
    id: "DEP-2026-0916-003",
    service: "order-service",
    version: "v3.4.1",
    previousVersion: "v3.4.0",
    status: "SUCCESS",
    deployedAt: "06:21",
    deployedBy: "CI/CD",
    commit: "c71a20d",
    branch: "main",
    changeSummary:
      "Improved order validation and database query performance.",
    incidentIds: ["INC-2026-0916-002"],
  },
  {
    id: "DEP-2026-0915-021",
    service: "auth-service",
    version: "v4.1.0",
    previousVersion: "v4.0.8",
    status: "SUCCESS",
    deployedAt: "22:34",
    deployedBy: "CI/CD",
    commit: "aa821f0",
    branch: "main",
    changeSummary:
      "Updated token validation and session handling.",
    incidentIds: [],
  },
  {
    id: "DEP-2026-0915-019",
    service: "notification-worker",
    version: "v1.9.2",
    previousVersion: "v1.9.1",
    status: "ROLLED_BACK",
    deployedAt: "20:41",
    deployedBy: "Manager",
    commit: "21dc918",
    branch: "main",
    changeSummary:
      "Worker retry configuration update.",
    incidentIds: ["INC-2026-0915-017"],
  },
];