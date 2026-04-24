type Category = "performance" | "stability" | "billing" | "ux" | "general";

const taxonomyRules: Record<Category, string[]> = {
  performance: ["slow", "lag", "delay"],
  stability: ["crash", "error", "freeze"],
  billing: ["payment", "transaction", "refund"],
  ux: ["ui", "design", "experience"],
  general: [],
};

function categorize(text: string): Category {
  const lower = text.toLowerCase();

  for (const [category, keywords] of Object.entries(taxonomyRules)) {
    if (keywords.some((word) => lower.includes(word))) {
      return category as Category;
    }
  }

  return "general";
}

export { Category, categorize };
