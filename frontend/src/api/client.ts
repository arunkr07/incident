import type { Incident, IncidentSeverity, IncidentSource, IncidentStatus, IncidentTimelineEvent, IncidentLog, IncidentMetricPoint, IncidentInvestigation } from "../types/incident";
import type { Deployment, LogEntry, MetricSeries, Service, ServiceDependency } from "../types/operations";
import type { Notification } from "../types/notifications";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "")
  || `${window.location.protocol}//${window.location.hostname}:8080`;
const TOKEN_KEY = "incident-token";

export interface ApiIncident {
  id: number; title: string; description: string; severity: IncidentSeverity;
  status: string; source: IncidentSource; serviceId: number; serviceName: string;
  startedAt: string; acknowledgedAt?: string | null; resolvedAt?: string | null;
  createdAt: string; updatedAt: string;
}
export interface ApiService {
  id: number; name: string; description?: string | null; status: "HEALTHY" | "DEGRADED" | "DOWN";
  environment?: string | null; endpoint?: string | null; createdAt: string; updatedAt: string;
}
export interface ApiDeployment {
  id: number; serviceId: number; serviceName: string; version: string; status: string;
  description?: string | null; startedAt?: string | null; completedAt?: string | null; createdAt: string;
}
export interface ApiLog {
  id: number; serviceId: number; serviceName: string; level: string; message: string;
  timestamp: string; traceId?: string | null; requestId?: string | null;
}
export interface ApiMetric {
  id: number; serviceId: number; serviceName: string; metricType: string;
  metricValue: number; recordedAt: string;
}
export interface ApiTimelineEvent {
  id: number; eventType: string; message: string; createdAt: string;
}
export interface ApiInvestigation {
  id: number; incidentId: number; status: string; rootCause?: string | null;
  confidence?: number | null; evidence?: string | null; recommendation?: string | null;
  followUpQuestions?: string | null; model?: string | null; startedAt?: string | null;
  completedAt?: string | null; errorMessage?: string | null;
}
export interface ApiNotification {
  id: number; eventId?: string | null; type: string; title: string; description: string;
  incidentId?: number | null; read: boolean; timestamp: string;
}
export interface ApiDetectionRule {
  id: number; serviceId: number; serviceName: string; name: string;
  metricType: "ERROR_RATE" | "LATENCY"; operator: "GREATER_THAN" | "GREATER_THAN_OR_EQUAL" | "LESS_THAN" | "LESS_THAN_OR_EQUAL";
  threshold: number; severity: IncidentSeverity; enabled: boolean; evaluationWindowSeconds: number;
}
export interface ApiRemediation {
  id: number; incidentId: number; serviceId: number; type: "RESTART_SERVICE" | "ROLLBACK_DEPLOYMENT" | "SCALE_SERVICE" | "DISABLE_DEPLOYMENT";
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "EXECUTING" | "COMPLETED" | "FAILED";
  reason?: string | null; risk?: string | null; parameters?: string | null; createdAt: string;
  approvedAt?: string | null; executedAt?: string | null; completedAt?: string | null;
  executionMessage?: string | null; failureReason?: string | null;
}
export type ManagerSettings = Record<string, unknown>;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  let body: unknown = undefined;
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }
  if (!response.ok) {
    const message = typeof body === "object" && body !== null && "message" in body
      ? String((body as { message: unknown }).message)
      : typeof body === "string" && body ? body : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return body as T;
}

const asArray = <T,>(value: T[] | null | undefined): T[] => Array.isArray(value) ? value : [];
const timeLabel = (value?: string | null) => value ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";
const durationLabel = (startedAt?: string | null, resolvedAt?: string | null) => {
  if (!startedAt) return "—";
  const start = new Date(startedAt).getTime();
  const end = resolvedAt ? new Date(resolvedAt).getTime() : Date.now();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return "—";
  const minutes = Math.floor((end - start) / 60000);
  return minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

export function mapNotification(raw: ApiNotification): Notification {
  const rawType = raw.type.toUpperCase();
  const type: Notification["type"] = rawType.includes("AI") ? "AI"
    : rawType.includes("DEPLOY") ? "DEPLOYMENT"
    : rawType.includes("SERVICE") || rawType.includes("DEGRAD") ? "SERVICE"
    : rawType.includes("RECOVER") || rawType.includes("RESOLV") ? "RECOVERY"
    : rawType.includes("CRITICAL") ? "CRITICAL" : "INCIDENT";
  const timestamp = raw.timestamp ? new Date(raw.timestamp) : null;
  const age = timestamp && Number.isFinite(timestamp.getTime()) ? Math.max(0, Math.floor((Date.now() - timestamp.getTime()) / 60000)) : null;
  const label = age == null ? "—" : age < 1 ? "now" : age < 60 ? `${age}m` : age < 1440 ? `${Math.floor(age / 60)}h` : `${Math.floor(age / 1440)}d`;
  return { id: String(raw.id), type, title: raw.title, description: raw.description, timestamp: label, read: raw.read };
}

export function mapIncident(raw: ApiIncident): Incident {
  const status: IncidentStatus = raw.status === "OPEN" ? "DETECTED" : raw.status as IncidentStatus;
  return {
    id: String(raw.id), title: raw.title, description: raw.description ?? "",
    service: raw.serviceName, severity: raw.severity, status,
    source: raw.source, startedAt: timeLabel(raw.startedAt),
    duration: durationLabel(raw.startedAt, raw.resolvedAt),
  };
}
export function mapService(raw: ApiService, metrics: ApiMetric[] = []): Service {
  const latest = (pattern: RegExp) => metrics
    .filter((metric) => pattern.test(metric.metricType))
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0]?.metricValue;
  const errorRate = latest(/error.?rate|failure.?rate/i);
  const latency = latest(/latency|duration/i);
  const requests = latest(/request.?rate|requests.?per.?second|throughput|rps/i);
  const uptime = latest(/uptime/i);
  return {
    id: String(raw.id), name: raw.name, description: raw.description ?? "",
    status: raw.status === "HEALTHY" ? "OPERATIONAL" : raw.status,
    version: "—", uptime: uptime == null ? "—" : `${uptime}%`,
    errorRate: errorRate == null ? "—" : `${errorRate}%`,
    latency: latency == null ? "—" : `${latency} ms`,
    requestsPerSecond: requests == null ? undefined : requests,
    environment: raw.environment ?? undefined, endpoint: raw.endpoint ?? undefined,
  };
}
export function mapDeployment(raw: ApiDeployment): Deployment {
  const status: Deployment["status"] = raw.status === "COMPLETED" ? "SUCCESS"
    : raw.status === "IN_PROGRESS" ? "IN_PROGRESS"
    : raw.status === "ROLLED_BACK" ? "ROLLED_BACK" : "FAILED";
  return {
    id: String(raw.id), service: raw.serviceName, version: raw.version,
    previousVersion: "—", status, deployedAt: timeLabel(raw.startedAt ?? raw.createdAt),
    deployedBy: "—", commit: "—", branch: "—", changeSummary: raw.description ?? "—", incidentIds: [],
  };
}
export function mapLog(raw: ApiLog): LogEntry {
  return {
    id: String(raw.id), timestamp: raw.timestamp ? new Date(raw.timestamp).toLocaleString() : "—",
    level: raw.level as LogEntry["level"], service: raw.serviceName, environment: "—",
    message: raw.message, traceId: raw.traceId ?? undefined, requestId: raw.requestId ?? undefined,
  };
}
export function mapMetricSeries(rawMetrics: ApiMetric[]): MetricSeries[] {
  const grouped = new Map<string, ApiMetric[]>();
  for (const metric of rawMetrics) grouped.set(metric.metricType, [...(grouped.get(metric.metricType) ?? []), metric]);
  return [...grouped.entries()].map(([name, items]) => ({
    name, unit: name.toLowerCase().includes("latency") ? "ms" : name.toLowerCase().includes("rate") ? "%" : "",
    description: `Recorded ${name.toLowerCase()} values from the backend.`,
    points: items.sort((a, b) => a.recordedAt.localeCompare(b.recordedAt)).map((item) => ({ timestamp: timeLabel(item.recordedAt), value: item.metricValue })),
  }));
}
export function mapTimelineEvent(raw: ApiTimelineEvent): IncidentTimelineEvent {
  const eventType = raw.eventType.toUpperCase();
  const type: IncidentTimelineEvent["type"] = eventType.includes("DEPLOY") ? "DEPLOYMENT"
    : eventType.includes("INVESTIG") ? "INVESTIGATION"
    : eventType.includes("RESOLV") ? "RESOLVED"
    : eventType.includes("ALERT") ? "ALERT" : "DETECTED";
  return { id: String(raw.id), timestamp: timeLabel(raw.createdAt), type, title: raw.eventType.replaceAll("_", " "), description: raw.message, actor: "SYSTEM" };
}
export function mapIncidentLog(raw: ApiLog): IncidentLog {
  const level: IncidentLog["level"] = raw.level === "ERROR" || raw.level === "FATAL" ? "ERROR" : raw.level === "WARN" ? "WARN" : "INFO";
  return { id: String(raw.id), timestamp: raw.timestamp ? new Date(raw.timestamp).toLocaleTimeString() : "—", level, service: raw.serviceName, message: raw.message, traceId: raw.traceId ?? undefined };
}
export function mapIncidentMetrics(rawMetrics: ApiMetric[]): { errorRate: IncidentMetricPoint[]; latency: IncidentMetricPoint[] } {
  const convert = (matcher: RegExp): IncidentMetricPoint[] => rawMetrics.filter((m) => matcher.test(m.metricType)).sort((a, b) => a.recordedAt.localeCompare(b.recordedAt)).map((m) => ({ time: timeLabel(m.recordedAt), value: m.metricValue }));
  return { errorRate: convert(/error|failure|rate/i), latency: convert(/latency|duration/i) };
}

export const api = {
  getIncidents: async (params: { status?: string; severity?: string; serviceId?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status === "DETECTED" ? "OPEN" : params.status);
    if (params.severity) query.set("severity", params.severity);
    if (params.serviceId != null) query.set("serviceId", String(params.serviceId));
    const suffix = query.size ? `?${query.toString()}` : "";
    return asArray(await request<ApiIncident[]>(`/api/incidents${suffix}`)).map(mapIncident);
  },
  getIncidentRaw: (id: string | number) => request<ApiIncident>(`/api/incidents/${encodeURIComponent(String(id))}`),
  getTimeline: async (id: string | number) => asArray(await request<ApiTimelineEvent[]>(`/api/incidents/${encodeURIComponent(String(id))}/timeline`)).map(mapTimelineEvent),
  getServices: async () => {
    const services = asArray(await request<ApiService[]>("/api/services"));
    const metrics = await api.getMetricsRaw().catch(() => [] as ApiMetric[]);
    return services.map((service) => mapService(service, metrics.filter((metric) => metric.serviceId === service.id)));
  },
  getServiceRaw: (id: string | number) => request<ApiService>(`/api/services/${encodeURIComponent(String(id))}`),
  getDeployments: async (serviceId?: number) => {
    const query = serviceId == null ? "" : `?serviceId=${encodeURIComponent(String(serviceId))}`;
    return asArray(await request<ApiDeployment[]>(`/api/deployments${query}`)).map(mapDeployment);
  },
  getDeploymentRaw: (id: string | number) => request<ApiDeployment>(`/api/deployments/${encodeURIComponent(String(id))}`),
  getLogsRaw: async (serviceId?: number) => {
    const query = serviceId == null ? "" : `?serviceId=${encodeURIComponent(String(serviceId))}`;
    return asArray(await request<ApiLog[]>(`/api/logs${query}`));
  },
  getLogs: async (serviceId?: number) => (await api.getLogsRaw(serviceId)).map(mapLog),
  getMetricsRaw: async (serviceId?: number) => {
    const query = serviceId == null ? "" : `?serviceId=${encodeURIComponent(String(serviceId))}`;
    return asArray(await request<ApiMetric[]>(`/api/metrics${query}`));
  },
  getMetrics: async (serviceId?: number) => mapMetricSeries(await api.getMetricsRaw(serviceId)),
  getDependencies: async () => {
    const raw = asArray(await request<Array<{ id: number; sourceServiceId: number; sourceServiceName: string; targetServiceId: number; targetServiceName: string; dependencyType: string }>>("/api/dependencies"));
    return raw.map((item): ServiceDependency => ({ source: String(item.sourceServiceId), target: String(item.targetServiceId), type: item.dependencyType as ServiceDependency["type"], status: "UNKNOWN" }));
  },
  getLatestInvestigation: (id: string | number) => request<ApiInvestigation>(`/api/incidents/${encodeURIComponent(String(id))}/investigations/latest`),
  startInvestigation: (id: string | number) => request<ApiInvestigation>(`/api/incidents/${encodeURIComponent(String(id))}/investigations`, { method: "POST" }),
  getNotifications: (unreadOnly = false) => request<ApiNotification[]>(`/api/notifications${unreadOnly ? "?unreadOnly=true" : ""}`),
  markNotificationRead: (id: string | number) => request<ApiNotification>(`/api/notifications/${encodeURIComponent(String(id))}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () => request<{ updatedCount: number }>("/api/notifications/read-all", { method: "PATCH" }),
  askAssistant: (incidentId: string | number, question: string) => request<{ incidentId: number; question: string; answer: string; model?: string; evidenceSources?: string[]; answeredAt?: string }>(`/api/incidents/${encodeURIComponent(String(incidentId))}/assistant/questions`, { method: "POST", body: JSON.stringify({ question }) }),
  getUnreadNotificationCount: () => request<{ unreadCount: number }>("/api/notifications/unread-count"),
  getNotificationModels: async (unreadOnly = false) => asArray(await request<ApiNotification[]>(`/api/notifications${unreadOnly ? "?unreadOnly=true" : ""}`)).map(mapNotification),
  createIncident: (body: { title: string; description: string; severity: IncidentSeverity; status?: string; source?: string; serviceId: number }) =>
    request<ApiIncident>("/api/incidents", { method: "POST", body: JSON.stringify(body) }),
  updateIncident: (id: string | number, body: Partial<{ title: string; description: string; severity: IncidentSeverity; status: string }>) =>
    request<ApiIncident>(`/api/incidents/${encodeURIComponent(String(id))}`, { method: "PATCH", body: JSON.stringify(body) }),
  createService: (body: { name: string; description?: string; status?: string; environment?: string; endpoint?: string }) =>
    request<ApiService>("/api/services", { method: "POST", body: JSON.stringify(body) }),
  updateService: (id: string | number, body: Partial<{ name: string; description: string; status: string; environment: string; endpoint: string }>) =>
    request<ApiService>(`/api/services/${encodeURIComponent(String(id))}`, { method: "PATCH", body: JSON.stringify(body) }),
  createDeployment: (body: { serviceId: number; version: string; status?: string; description?: string }) =>
    request<ApiDeployment>("/api/deployments", { method: "POST", body: JSON.stringify(body) }),
  updateDeployment: (id: string | number, body: Partial<{ serviceId: number; version: string; status: string; description: string }>) =>
    request<ApiDeployment>(`/api/deployments/${encodeURIComponent(String(id))}`, { method: "PATCH", body: JSON.stringify(body) }),
  getDetectionRules: () => request<ApiDetectionRule[]>("/api/detection/rules"),
  updateDetectionRule: (id: string | number, body: Partial<Pick<ApiDetectionRule, "name" | "metricType" | "operator" | "threshold" | "severity" | "enabled" | "evaluationWindowSeconds">>) =>
    request<ApiDetectionRule>(`/api/detection/rules/${encodeURIComponent(String(id))}`, { method: "PATCH", body: JSON.stringify(body) }),
  createDetectionRule: (body: Omit<ApiDetectionRule, "id" | "serviceName">) =>
    request<ApiDetectionRule>("/api/detection/rules", { method: "POST", body: JSON.stringify(body) }),
  getRemediations: (incidentId: string | number) =>
    request<ApiRemediation[]>(`/api/incidents/${encodeURIComponent(String(incidentId))}/remediations`),
  createRemediation: (incidentId: string | number, body: { type: ApiRemediation["type"]; serviceId: number; reason: string; risk: string; parameters?: string }) =>
    request<ApiRemediation>(`/api/incidents/${encodeURIComponent(String(incidentId))}/remediations`, { method: "POST", body: JSON.stringify(body) }),
  approveRemediation: (id: string | number) =>
    request<ApiRemediation>(`/api/incidents/remediations/${encodeURIComponent(String(id))}/approve`, { method: "POST" }),
  rejectRemediation: (id: string | number, reason: string) =>
    request<ApiRemediation>(`/api/incidents/remediations/${encodeURIComponent(String(id))}/reject?reason=${encodeURIComponent(reason)}`, { method: "POST" }),
  executeRemediation: (id: string | number) =>
    request<ApiRemediation>(`/api/incidents/remediations/${encodeURIComponent(String(id))}/execute`, { method: "POST" }),
  getSettings: () => request<ManagerSettings>("/api/settings"),
  saveSettings: (settings: ManagerSettings) => request<ManagerSettings>("/api/settings", { method: "PUT", body: JSON.stringify(settings) }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<void>("/api/auth/password", { method: "PATCH", body: JSON.stringify({ currentPassword, newPassword }) }),
};

export function mapApiInvestigation(raw: ApiInvestigation) {
  let evidence: string[] = [];
  if (raw.evidence) {
    try { const parsed: unknown = JSON.parse(raw.evidence); evidence = Array.isArray(parsed) ? parsed.map(String) : [raw.evidence]; }
    catch { evidence = raw.evidence.split(/\r?\n/).map((s) => s.trim()).filter(Boolean); }
  }
  return {
    incidentId: String(raw.incidentId), hypothesis: raw.rootCause ?? "No root-cause hypothesis returned.",
    confidence: raw.confidence == null ? 0 : raw.confidence <= 1 ? Math.round(raw.confidence * 100) : Math.round(raw.confidence), summary: raw.errorMessage ?? (raw.status === "COMPLETED" ? "Investigation completed." : `Investigation status: ${raw.status}`),
    evidence: evidence.map((description, index) => ({ id: String(index + 1), source: "INCIDENT" as const, title: `Evidence ${index + 1}`, description, relevance: "MEDIUM" as const })),
    recommendation: raw.recommendation ?? "No remediation recommendation returned.", generatedAt: raw.completedAt ?? raw.startedAt ?? new Date().toISOString(),
  };
}

export function buildInvestigation(rawIncident: ApiIncident, timeline: IncidentTimelineEvent[], rawLogs: ApiLog[], rawMetrics: ApiMetric[], ai?: ApiInvestigation): IncidentInvestigation {
  const metrics = mapIncidentMetrics(rawMetrics);
  const rootCause = ai?.rootCause ?? undefined;
  let evidence: string[] | undefined;
  if (ai?.evidence) {
    try { const parsed: unknown = JSON.parse(ai.evidence); evidence = Array.isArray(parsed) ? parsed.map(String) : [ai.evidence]; }
    catch { evidence = ai.evidence.split(/\r?\n/).map((s) => s.trim()).filter(Boolean); }
  }
  return {
    incident: mapIncident(rawIncident), timeline, metrics,
    logs: rawLogs.map(mapIncidentLog), rootCause, confidence: ai?.confidence ?? undefined,
    evidence, recommendation: ai?.recommendation ?? undefined,
  };
}

export async function getSettingsSection<T extends object>(key: string, defaults: T): Promise<T> {
  const settings = await api.getSettings();
  const saved = settings[key];
  return saved && typeof saved === "object" && !Array.isArray(saved)
    ? { ...defaults, ...(saved as Partial<T>) }
    : defaults;
}

export async function saveSettingsSection<T extends object>(key: string, value: T): Promise<T> {
  const response = await api.saveSettings({ [key]: value });
  const saved = response[key];
  return saved && typeof saved === "object" && !Array.isArray(saved) ? saved as T : value;
}
