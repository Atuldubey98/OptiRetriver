import { PDFParse } from "pdf-parse";

class GeneralProcessor implements DocumentProcessor {
    constructor() {
        
    }
   async parseBufferToText(buffer: Buffer) {
    try {
      const pdfParser = new PDFParse({ data: buffer });
      const textContent = await pdfParser.getText();
      return textContent.text;
    } catch (error) {
      console.error("Error parsing PDF buffer:", error);
      throw new Error("Failed to parse PDF buffer");
    }
  }
}

export default GeneralProcessor;