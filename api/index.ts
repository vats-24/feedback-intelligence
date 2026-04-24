import express from "express";
import { Pool } from "pg";

const app = express();
const port = 3000;

const pool = new Pool({
  user: "user",
  host: "localhost",
  database: "feedback_db",
  password: "password",
  port: 5433,
});

app.get("/insights/top-issues", async (req, res) => {
  const result = await pool.query(`
    SELECT category, COUNT(*) as count
    FROM feedback_insights
    GROUP BY category
    ORDER BY count DESC
    LIMIT 5
  `);

  res.json(result.rows);
});

app.get("/insights/category-breakdown", async (req, res) => {
  const result = await pool.query(`
    SELECT category, COUNT(*) as count
    FROM feedback_insights
    GROUP BY category
  `);

  res.json(result.rows);
});

app.get("/insights/sentiment-trend", async (req, res) => {
  const result = await pool.query(`
    SELECT sentiment_label, COUNT(*) as count
    FROM feedback_insights
    GROUP BY sentiment_label
  `);

  res.json(result.rows);
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
