export type AIInvestigationStatus =
  | "IDLE"
  | "COLLECTING_CONTEXT"
  | "ANALYZING"
  | "COMPLETE"
  | "FAILED";

export interface InvestigationEvidence {
  id: string;
  source:
    | "LOG"
    | "METRIC"
    | "DEPLOYMENT"
    | "DEPENDENCY"
    | "INCIDENT";
  title: string;
  description: string;
  timestamp?: string;
  relevance: "HIGH" | "MEDIUM" | "LOW";
}

export interface AIInvestigationResult {
  incidentId: string;
  hypothesis: string;
  confidence: number;
  summary: string;
  evidence: InvestigationEvidence[];
  recommendation: string;
  generatedAt: string;
}