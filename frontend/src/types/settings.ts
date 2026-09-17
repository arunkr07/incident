export interface DetectionSettingsState {
  errorRateThreshold: number;
  latencyThreshold: number;
  evaluationWindow: number;
  automaticIncidentCreation: boolean;
}

export interface NotificationSettingsState {
  criticalIncidents: boolean;
  newIncidents: boolean;
  aiCompleted: boolean;
  serviceDegraded: boolean;
  deploymentEvents: boolean;
  recoveryEvents: boolean;
}

export interface AISettingsState {
  enabled: boolean;
  model: string;
  includeLogs: boolean;
  includeMetrics: boolean;
  includeDeployments: boolean;
  includeDependencies: boolean;
}

export interface ApprovalSettingsState {
  requireApproval: boolean;
  highRiskOnly: boolean;
}