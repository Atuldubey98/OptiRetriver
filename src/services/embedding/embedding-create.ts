import { ClientSession } from "mongoose";

import TextProcessingService from "../chunk/text-processor-service";
import GeneralModel from "../../models/general-model";

export interface IEmbeddingCreateService {
  createEmbeddings: (
    embeddings: number[][],
    entityId: string,
    chunks: string[],
    session?: ClientSession
  ) => Promise<void>;
}

export class GeneralModelEmbeddingCreateService implements IEmbeddingCreateService {
  private textProcessorService: TextProcessingService;
  constructor() {
    this.textProcessorService = new TextProcessingService();
  }
  async createEmbeddings(
    embeddings: number[][],
    entityId: string,
    chunks: string[],
    session?: ClientSession
  ): Promise<void> {
    try {
      const documents = embeddings.map((emb, index) => ({
        content: this.textProcessorService.processChunk(chunks[index]),
        embeddings: emb,
        entity: entityId,
      }));
      await GeneralModel.insertMany(documents, { session });
    } catch (error) {
        throw error;
    }
  }
}
