import { IEmbeddingCreateService, GeneralModelEmbeddingCreateService } from "./embedding-create";
import EmbeddingStrategy from "./embedding-strategy";
import OllamaEmbeddingStrategyImpl from "./ollama-embedding";

class EmbeddingLoaderService {
    constructor() {}
    public static loadEmbeddingService(llmServiceStr? : string) : EmbeddingStrategy {
        if (llmServiceStr === "ollama") {
            return new OllamaEmbeddingStrategyImpl("nomic-embed-text");
        }
        throw new Error(`LLM Service ${llmServiceStr} not supported`);        
    }
    public static getEmbeddingCreateService(typeOfDoc : string) : IEmbeddingCreateService{
        if(typeOfDoc === "general"){
            return new GeneralModelEmbeddingCreateService();
        }
        throw new Error(`Embedding Create Service for ${typeOfDoc} not supported`);
    }
}

export default EmbeddingLoaderService;