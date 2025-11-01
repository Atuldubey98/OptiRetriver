import { PDFParse } from "pdf-parse";
import TextProcessingService from "../chunk/text-processor-service";
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
      return this.textProcessorService.getChunks(text, 600, 50);
    } catch (error) {
      console.error("Error parsing PDF buffer:", error);
      throw error;
    } finally{
      await pdfParser.destroy();
    }
  }
}
