# 🚀 Customer Feedback Intelligence Pipeline

An event-driven system that ingests, processes, and transforms unstructured customer feedback into actionable insights.

---

## 🧠 Problem

Modern products receive feedback from multiple sources:

- App reviews
- Support tickets
- Chat logs

This data is typically:

- **Unstructured:** Hard to parse for specific themes.
- **Distributed:** Scattered across different platforms/silos.
- **Hard to analyze at scale:** Manual review becomes impossible as volume grows.

👉 **Product teams struggle to answer:**

- What are the top customer complaints?
- Which features are causing churn?
- How is sentiment changing over time?

---

## 💡 Solution

This project simulates a **production-style feedback intelligence pipeline** that:

1. Ingests feedback events from multiple sources.
2. Normalizes them into a unified schema.
3. Processes them using lightweight NLP.
4. Categorizes them via a taxonomy engine.
5. Stores structured insights.
6. Exposes analytics via APIs.
7. Handles failures robustly (retries, DLQ, idempotency).

---

## 🏗️ Architecture

`Producers` → `RabbitMQ` → `Consumer` → `Processing` → `PostgreSQL` → `API`

---

## ⚙️ Tech Stack

- **Language:** TypeScript
- **Queue:** RabbitMQ
- **Database:** PostgreSQL
- **API:** Express.js
- **NLP:** Lightweight sentiment + rule-based taxonomy Future Scope- can add winkNLP or some custom NLP model
- **Infra:** Docker

---

## 🔄 System Flow

### 1. Ingestion Layer

Simulated sources (`app_reviews.json`, `support_tickets.json`, `chat_logs.json`) are normalized into a unified format:

```json
{
  "id": "string",
  "source": "app_review | support_ticket | chat",
  "text": "string",
  "timestamp": "ISO string",
  "userId": "string"
}
```

````

### 2. Message Queue (RabbitMQ)

- Decouples producers and consumers.
- Handles burst traffic.
- Enables retries and failure isolation.

### 3. Processing Pipeline

Each event passes through two main stages:

#### 🔹 Sentiment Analysis

Basic polarity detection: `Positive`, `Neutral`, or `Negative`.

#### 🔹 Taxonomy Engine (Rule-based)

Maps feedback into categories using keyword matching:
| Keywords | Category |
| :--- | :--- |
| slow, lag | **Performance** |
| crash, bug | **Stability** |
| payment, billing | **Billing** |
| UI, UX, design | **Usability** |

### 4. Storage Layer (PostgreSQL)

Data is persisted in the `feedback_insights` table:

- `id` (PK), `source`, `raw_text`, `sentiment_score`, `sentiment_label`, `category`, `created_at`.

### 5. API Layer

Exposes endpoints for aggregated intelligence:

- `GET /insights/top-issues`
- `GET /insights/category-breakdown`
- `GET /insights/sentiment-trend`

---

## 📊 Observability

### Metrics (In-memory)

- Total events processed
- Successful vs. Failed events
- Average processing time

### Logging

Each stage logs lifecycle events:

- Event received
- Processing success/failure
- Retries and DLQ routing

---

## 💥 Failure Handling (Core Strength)

- **🔁 Retry Mechanism:** Retries failed messages up to 3 times using message headers (`x-retries`).
- **☠️ Dead Letter Queue (DLQ):** Messages exceeding the retry limit are moved to a DLQ to prevent pipeline blockage and allow for manual inspection.
- **🛡️ Idempotency:** Uses `ON CONFLICT (id) DO NOTHING` during database insertion to ensure duplicate messages do not cause data corruption or redundant processing.

---

## 🧪 Running the Project

### 1. Start Infrastructure

```bash
docker compose up -d
```

### 2. Setup Database

```bash
docker exec -it feedback-intelligence-postgres-1 psql -U user -d feedback_db
```

```sql
CREATE TABLE feedback_insights (
  id TEXT PRIMARY KEY,
  source TEXT,
  raw_text TEXT,
  sentiment_score INT,
  sentiment_label TEXT,
  category TEXT,
  created_at TIMESTAMP
);
```

### 3. Run Services

```bash
# Consumer
npx ts-node consumer/index.ts

# Producer
npx ts-node producer/index.ts

# API
npx ts-node api/index.ts
```

### 4. Test API

- `http://localhost:3000/insights/top-issues`
- `http://localhost:3000/insights/category-breakdown`
- `http://localhost:3000/insights/sentiment-trend`

---

## 📌 Design Decisions

- **RabbitMQ over Kafka:** Simpler setup and sufficient for this event-driven use case.
- **Rule-based taxonomy:** Prioritizes speed, interpretability, and low overhead over complex ML.
- **PostgreSQL:** Provides strong querying capabilities for structured analytics.
- **No custom ML models:** Focuses on robust system design and data engineering rather than model training.

---

## ⚖️ Tradeoffs

- Taxonomy is static (not dynamically learned).
- Metrics are in-memory (not persistent across restarts).
- No real-time dashboard included (API-only).
- NLP is lightweight (keyword/rule-based rather than semantic/embedding-based).

---

## 🚀 Future Improvements

- Implement a scalable worker pool (horizontal consumer scaling).
- Persist metrics using Redis.
- Add real-time dashboards (e.g., Grafana).
- Transition to embedding-based clustering for semantic grouping.
- Integrate LLM-powered dynamic taxonomy.

---

## 🎯 Key Learnings

This project demonstrates proficiency in:

- Event-driven architecture.
- Queue-based systems and asynchronous processing.
- Fault tolerance (retries, DLQ).
- Idempotent processing logic.
- Data modeling & normalization.

---

## 👤 Me

Built as a system design and backend engineering project to demonstrate real-world distributed system thinking.

```

```
````
