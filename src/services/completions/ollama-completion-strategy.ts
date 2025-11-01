import axios from "axios";
import { CompletionStrategy } from "./completion-strategy";

class OllamaCompletionStrategy implements CompletionStrategy {
  private readonly model;
  private readonly mcp;
  constructor(model: string) {
    this.mcp = axios.create({
      baseURL: "http://localhost:11434",
    });
    this.model = model;
  }
  async complete(prompt: string): Promise<string> {
    try {
      const response = await this.mcp.post("/api/generate", {
        model: this.model,
        prompt,
        stream : false,
      });      
      return response.data.response;
    } catch (error) {
      throw error;
    }
  }
}

export default OllamaCompletionStrategy;
