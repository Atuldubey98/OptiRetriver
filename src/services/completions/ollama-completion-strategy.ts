import axios from "axios";
import { CompletionStrategy } from "./completion-strategy";

class OllamaCompletionStrategy implements CompletionStrategy {
  private readonly model: string;
  private readonly mcp;

  constructor(model: string) {
    this.mcp = axios.create({
      baseURL: "http://192.168.1.38:11434",
    });
    this.model = model;
  }

  // 🔹 Non-stream (default)
  async complete(prompt: string): Promise<string> {
    const response = await this.mcp.post("/api/generate", {
      model: this.model,
      prompt,
      stream: false,
    });
    return response.data.response;
  }

  // 🔹 Streamed version
  async streamComplete(prompt: string, onChunk: (text: string) => void): Promise<void> {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: this.model, prompt, stream: true }),
    });

    if (!response.body) throw new Error("No response body received from Ollama");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value);
        chunk
          .split("\n")
          .filter(Boolean)
          .forEach((line) => {
            try {
              const json = JSON.parse(line);
              if (json.response) onChunk(json.response);
            } catch {
              // skip invalid chunks
            }
          });
      }
    }
  }
}

export default OllamaCompletionStrategy;
