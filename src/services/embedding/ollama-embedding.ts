import axios from "axios";
import EmbeddingStrategy from "./embedding-strategy";

class OllamaEmbeddingStrategyImpl implements EmbeddingStrategy {
  private readonly model;
  private readonly mcp;
  constructor(model: string) {
    this.mcp = axios.create({
      baseURL: "http://192.168.1.38:11434",
    });
    this.model = model;
  }
  async generateEmbeddings(chunks: string[]) {
    try {
      const response = await this.mcp.post("/api/embed", {
        model: this.model,
        input: chunks,
      });
      return response.data.embeddings;
    } catch (error) {
      throw error;
    }
  }
  async generateQueryEmbedding(text: string) {
    try {
      const response = await this.mcp.post("/api/embed", {
        model: this.model,
        input: text,
      });
      return response.data.embeddings[0];
    } catch (error) {
      throw error;
    }
  }
}

export default OllamaEmbeddingStrategyImpl;
