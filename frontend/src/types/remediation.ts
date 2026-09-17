export type RemediationState =
  | "PROPOSED"
  | "APPROVED"
  | "REJECTED"
  | "EXECUTING"
  | "SUCCEEDED"
  | "FAILED";

export interface RemediationAction {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  state: RemediationState;
  requiresApproval: boolean;
}