import { PDFParse } from "pdf-parse";
import TextProcessingService from "../chunk/text-processor-service";
import EmbeddingLoaderService from "../embedding/embedding-loader-service";
export class InvoiceProcessor implements DocumentProcessor {
  private textProcessorService: TextProcessingService;
  constructor() {
    this.textProcessorService = new TextProcessingService();
  }
  async parseBufferToChunks(buffer: Buffer): Promise<string[]> {
    const pdfParser = new PDFParse({ data: buffer });
    try {
      const results = await pdfParser.getText();
      const text = results.text;
      const llmService = EmbeddingLoaderService.loadResponseService("ollama");
      const rinsedText = await llmService.complete(`
You are a document structuring specialist for business documents such as Invoices, Quotations, and Purchase Orders.

Your goal is to reconstruct clean, structured text from a possibly broken or partial OCR/PDF extraction.

---

### TASK
Read the text and extract:
1. Header Fields — document type, numbers, parties, dates, PO info, totals, taxes, etc.
2. Line Items — all product/service lines with structured detail.
3. Terms and Conditions — all listed or descriptive terms, normalized as clear bullet points.

If the text is split or incomplete, extract only what is visible. Do not invent or infer.

---

### RULES
- Never guess or infer.
- Always use the same labels and order.
- Wrap all field values and list items in double quotes ("").
- Format all dates as YYYY-MM-DD.
- Use a clean, indented bullet list format for both Items and Terms & Conditions.
- Maintain plain text only (no JSON, Markdown, or explanations).
- If a field or section is missing, output empty quotes ("").

---

### INPUT TEXT
"""
${text}
"""

---

### OUTPUT FORMAT (exact)

Document Type: "<type>"
Document No.: "<number>"
Vendor: "<vendor>"
Customer: "<customer>"
Date: "<date>"
Due Date: "<due_date>"
PO No.: "<po_number>"
PO Date: "<po_date>"

Items:
  - "<item_name>", HSN/SAC: "<code>", Qty: "<qty>", Unit: "<unit>", Rate: "<unit_price>", GST: "<gst_percent>", Total: "<amount>"
  - "<item_name>", HSN/SAC: "<code>", Qty: "<qty>", Unit: "<unit>", Rate: "<unit_price>", GST: "<gst_percent>", Total: "<amount>"
  - ...

Subtotal: "<subtotal>"
Taxes: "<tax_name amount>"
Total: "<total>"
Currency: "<currency>"
Payment Terms: "<terms>"
Bank Details: "<bank_name> <acc_no> <ifsc>"

Terms & Conditions:
  - "<condition_1>"
  - "<condition_2>"
  - "<condition_3>"
  - "<condition_4>"
  - "<condition_5>"
  - ...
`);

      return this.textProcessorService.getChunks(rinsedText, 500, 100);
    } catch (error) {
      console.error("Error parsing PDF buffer:", error);
      throw error;
    } finally {
      await pdfParser.destroy();
    }
  }
}
