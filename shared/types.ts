export type SourceType = "app_review" | "support_ticket" | "chat_log";

export interface FeedbackEvent {
  id: string;
  source: string;
  text: string;
  timestamp: string;
  userId: string;
}
