import { OllamaEmbeddings } from "@langchain/ollama";
import EmbeddingStrategy from "./embedding-strategy";

class OllamaEmbeddingStrategyImpl implements EmbeddingStrategy {
    private llmModel : OllamaEmbeddings
    constructor(model : string) {
        this.llmModel = new OllamaEmbeddings({model});
    }
    generateEmbeddings(chunks : string[]) {
        return this.llmModel.embedDocuments(chunks)
    }
    generateQueryEmbedding(text: string) {
        return this.llmModel.embedQuery(text);
    }
}

export default OllamaEmbeddingStrategyImpl