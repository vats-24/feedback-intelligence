import Sentiment from "sentiment";

const sentiment = new Sentiment();

export function analyzeSentiment(text: string) {
  const result = sentiment.analyze(text);

  return {
    score: result.score,
    label:
      result.score > 0 ? "positive" : result.score < 0 ? "negative" : "neutral",
  };
}
