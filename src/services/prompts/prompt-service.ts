export interface PromptService {
  makePrompt(chunks: string[], question: string): string;
}

export class PromptFactory {
  public static getPromptFactory(type: string): PromptService {
    switch (type) {
      case "general":
        return new GeneralDocPrompt();
      case "invoice":
        return new InvoiceDocPrompt();
      default:
        throw new Error("Unsupported document query service type");
    }
  }
}

export  class GeneralDocPrompt implements PromptService {
  makePrompt(chunks: string[], question: string): string {
    const context = chunks.join("\n\n");

    return `
You are an intelligent and helpful assistant. You have access to some contextual documents that may contain useful information.

Instructions:
1. Carefully read the context below to see if it’s relevant to the user’s question.
2. If the context is relevant, use it to form an accurate, concise answer.
3. If the context is **not relevant or incomplete**, ignore it and answer naturally using your own knowledge.
4. Never mention the words “context”, “document”, or “source” in your reply.

---
CONTEXT:
${context}

---
QUESTION:
${question}

---
RESPONSE RULES:
- Give a **clear and complete** answer.
- Do **not** restate the question.
- Do **not** say things like “based on the context”.
- If the answer cannot be found, answer normally using general knowledge.
- Keep it factual, fluent, and human-like.

Now respond to the question:
`;
  }
}
export class InvoiceDocPrompt implements PromptService {
  makePrompt(chunks: string[], question: string): string {
    const context = chunks.join("\n\n");

    return `
You are an intelligent assistant trained to understand and reason about business financial documents such as invoices, quotations, receipts, and purchase orders.

Your objectives:
1. Analyze the given context carefully to extract or reference relevant information such as:
   - Document type (invoice, quotation, etc.)
   - Document number or ID
   - Date(s)
   - Vendor or supplier name
   - Buyer or client name
   - Line items (description, quantity, rate, amount)
   - Taxes, discounts, and totals
   - Payment terms or due dates
2. If the question directly relates to this context, answer using only the information found within it.
3. If the context is **irrelevant or incomplete**, ignore it and respond using general knowledge — but **never** mention that context was missing.
4. Prioritize **precision in numbers, amounts, and entities** (company names, dates, etc.).

---
CONTEXT:
${context}

---
QUESTION:
${question}

---
RESPONSE RULES:
- Provide a **factual, well-structured, and complete** answer.
- If numerical or tabular data is requested, include values clearly (you may use bullet points or simple tables).
- Do **not** restate the question.
- Do **not** say phrases like “based on the context” or “from the document”.
- Keep the tone professional, concise, and businesslike.
- If the information isn’t present, give a general or explanatory answer relevant to the question.
- Avoid unnecessary formatting unless it improves clarity (e.g., lists, tables).

Now generate the answer:
`;
  }
}
