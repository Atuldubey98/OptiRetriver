import { CompletionStrategy } from "../completions/completion-strategy";
import OllamaCompletionStrategy from "../completions/ollama-completion-strategy";
import {
  IEmbeddingCreateService,
  GeneralModelEmbeddingCreateService,
  InvoiceModelEmbeddingCreateService,
} from "./embedding-create";
import EmbeddingStrategy from "./embedding-strategy";
import OllamaEmbeddingStrategyImpl from "./ollama-embedding";

class EmbeddingLoaderService {
  constructor() {}
  public static loadEmbeddingService(
    llmServiceStr?: string
  ): EmbeddingStrategy {
    if (llmServiceStr === "ollama") {
      return new OllamaEmbeddingStrategyImpl("nomic-embed-text");
    }
    throw new Error(`LLM Service ${llmServiceStr} not supported`);
  }
  public static loadResponseService(
    llmServiceStr?: string
  ): CompletionStrategy {
    if (llmServiceStr === "ollama") {
      return new OllamaCompletionStrategy("phi3");
    }
    throw new Error(`LLM Service ${llmServiceStr} not supported`);
  }
  public static getEmbeddingCreateService(
    typeOfDoc: string
  ): IEmbeddingCreateService {
    if (typeOfDoc === "general") {
      return new GeneralModelEmbeddingCreateService();
    }
    if (typeOfDoc === "invoice") {
      return new InvoiceModelEmbeddingCreateService();
    }
    throw new Error(`Embedding Create Service for ${typeOfDoc} not supported`);
  }
}

export default EmbeddingLoaderService;
