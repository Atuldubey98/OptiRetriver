class TextProcessingService {
  constructor() {}
  private rinseText(text: string): string {
    return text
      .replace(/\r?\n|\r/g, " ")
      .replace(/\s+/g, " ")
      .replace(/[^\x20-\x7E]+/g, "")
      .trim();
  }
  processChunk(chunk: string){
    return this.rinseText(chunk);
  }
   getChunks(text: string, chunkSize: number = 500, overlap: number = 0): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.slice(start, end));
      start += chunkSize - overlap;
    }
    return chunks;
  }
}

export default TextProcessingService;
