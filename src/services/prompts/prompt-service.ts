export interface PromptService {
  makePrompt(chunks: string[], question: string): string;
}

export class PromptFactory {
  public static getPromptFactory(type: string): PromptService {
    switch (type) {
      case "general":
        return new GeneralDocPrompt();
      default:
        throw new Error("Unsupported document query service type");
    }
  }
}
export default class GeneralDocPrompt implements PromptService {
  makePrompt(chunks: string[], question: string): string {
    const template = `You are an intelligent assistant with access to external contextual documents.

Your task:
1. Read and understand the provided context below.
2. If the context contains enough information to answer the question, use only that context.
3. If not, use your own knowledge — but **do not mention that the context was incomplete** or that you are reasoning on your own.

---
CONTEXT:
${chunks.join("\n")}

---
QUESTION:
${question}

---
RESPONSE RULES:
- Give **only the direct answer**, without any prefix such as “According to the context” or “Based on the information”.
- Do **not** repeat or restate the question.
- Do **not** mention the context or source.
- Keep the tone factual, concise, and neutral.
- Output **only the final answer text** — no extra formatting, explanations, or disclaimers.

Now provide the answer:
`;
    return template;
  }
}
