import { Pool } from "pg";

export const pool = new Pool({
  user: "user",
  host: "localhost",
  database: "feedback_db",
  password: "password",
  port: 5433,
});
