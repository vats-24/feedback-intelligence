import { FeedbackEvent } from "../shared/types";

export function normalizeAppReview(data: any): FeedbackEvent {
  return {
    id: data.reviewId,
    source: "app_review",
    text: data.reviewText,
    timestamp: data.createdAt,
    userId: data.user,
  };
}

export function normalizeSupportTicket(data: any): FeedbackEvent {
  return {
    id: data.ticketId,
    source: "support_ticket",
    text: data.description,
    timestamp: data.timestamp,
    userId: data.customerId,
  };
}

export function normalizeChatLog(data: any): FeedbackEvent {
  return {
    id: data.chatId,
    source: "chat_log",
    text: data.message,
    timestamp: data.time,
    userId: data.senderId,
  };
}
