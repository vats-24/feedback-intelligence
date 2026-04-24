import amqp from "amqplib";
import { FeedbackEvent } from "../shared/types";
import { analyzeSentiment } from "./processor";
import { categorize } from "./taxanomy";
import { pool } from "./db";
import { metrics } from "./metrics";

const QUEUE = "feedback";
const DLQ = "feedback_dlq";

const MAX_RETRIES = 3;

async function startConsumer() {
  const conn = await amqp.connect("amqp://admin:admin123@localhost:5672");
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });
  await channel.assertQueue(DLQ, { durable: true });

  console.log("Waiting for messages");

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    const event: FeedbackEvent = JSON.parse(msg.content.toString());
    const retries = msg.properties.headers?.["x-retries"] || 0;
    const start = Date.now();
    metrics.total++;

    console.log(`[RECEIVED] ${event.id}`);

    try {
      //   for doing the simulation of failures
      if (Math.random() < 0.1) {
        throw new Error("Random failure");
      }

      const sentiment = analyzeSentiment(event.text);
      const category = categorize(event.text);

      await pool.query(
        `INSERT INTO feedback_insights 
        (id, source, raw_text, sentiment_score, sentiment_label, category, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING`,
        [
          event.id,
          event.source,
          event.text,
          sentiment.score,
          sentiment.label,
          category,
          event.timestamp,
        ]
      );

      metrics.success++;
      metrics.record(Date.now() - start);

      console.log(`[SUCCESS] ${event.id} (retries: ${retries})`);
      console.log(`[METRICS]`, {
        total: metrics.total,
        success: metrics.success,
        failure: metrics.failure,
        avgTime: metrics.avg(),
      });
      channel.ack(msg);
    } catch (err) {
      metrics.failure++;
      console.log(`FAIL: ${event.id} attempt ${retries}`);
      if (retries < MAX_RETRIES) {
        channel.sendToQueue(QUEUE, msg.content, {
          persistent: true,
          headers: { "x-retries": retries + 1 },
        });
        console.log(`retrying ${event.id} with havng (${retries + 1})`);
      } else {
        channel.sendToQueue(DLQ, msg.content, {
          persistent: true,
        });

        console.log(`Sending to DLQ:- ${event.id}`);
      }
      channel.ack(msg);
    }
  });
}

startConsumer().catch(console.error);
