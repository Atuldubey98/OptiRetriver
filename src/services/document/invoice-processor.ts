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
   You are a business document normalizer.

Your task is to extract and normalize only the important invoice or purchase document details from the text below.  
The text may be partial or chunked. Extract what’s available and output it in a clean, quoted, line-by-line format.  
If a field is missing, output it as "" (empty quotes). Do not guess or infer.

Context:
"""
${text}
"""

Output Rules:
- Always include the following fields in the same order.
- Wrap all values in double quotes ("").
- Detect and extract "Document Type" (e.g. "Invoice", "Quotation", "Receipt", "Purchase Order", "Tax Invoice").
- Detect and extract "Document No".
- Detect all the line items from the Document
- Extract all relevant details: vendor, customer, date, due date, subtotal, taxes, total, currency, and payment terms.
- Combine all items into one line, comma-separated.
- Use plain text only — no explanations, no markdown, no JSON.
- Dates must be formatted as "YYYY-MM-DD" when possible.

Output Format (exact):
Document Type: "<type>"  
Document No.: "<number>"  
Vendor: "<vendor>"  
Customer: "<customer>"  
Date: "<date>"  
Due Date: "<due_date>"  
Items: 
  - <item1 (qty x unit = total), item2 (qty x unit = total)>  
  - <item2 (qty x unit = total), item2 (qty x unit = total)>
  -----Till number of items  
Subtotal: "<subtotal>"  
Taxes: "<tax_name amount>"  
Total: "<total>"  
Currency: "<currency>"  
Payment Terms: "<terms>"
      `);
      return this.textProcessorService.getChunks(rinsedText, 800, 80);
    } catch (error) {
      console.error("Error parsing PDF buffer:", error);
      throw error;
    } finally {
      await pdfParser.destroy();
    }
  }
}
