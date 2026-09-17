export type NotificationType =
  | "INCIDENT"
  | "CRITICAL"
  | "AI"
  | "SERVICE"
  | "DEPLOYMENT"
  | "RECOVERY";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}