import amqp from "amqplib";
import fs from "fs";
import path from "path";
import {
  normalizeAppReview,
  normalizeSupportTicket,
  normalizeChatLog,
} from "./normalize";
import { FeedbackEvent } from "../shared/types";

const QUEUE = "feedback";

async function sendBatch() {
  const conn = await amqp.connect("amqp://admin:admin123@localhost:5672");
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  const appReviews = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "sample-data/app_reviews.json"),
      "utf-8"
    )
  );

  const tickets = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "sample-data/support_ticket.json"),
      "utf-8"
    )
  );

  const chats = JSON.parse(
    fs.readFileSync(path.join(__dirname, "sample-data/chat_logs.json"), "utf-8")
  );

  const events: FeedbackEvent[] = [
    ...appReviews.map(normalizeAppReview),
    ...tickets.map(normalizeSupportTicket),
    ...chats.map(normalizeChatLog),
  ];

  for (const event of events) {
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(event)), {
      persistent: true,
    });

    console.log("Sent:-", event.id);
  }

  await channel.close();
  await conn.close();
}

sendBatch().catch(console.error);
