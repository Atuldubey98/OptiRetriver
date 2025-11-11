import path from "path";
import EntityModel from "../../models/entity-model";
import TextProcessingService from "../chunk/text-processor-service";
import { IEmbeddingCreateService } from "../embedding/embedding-create";
import IDocumentService from "./document-service";
import GeneralProcessor from "./general-processor";
import { InvoiceProcessor } from "./invoice-processor";
import GeneralModel from "../../models/general-model";
import InvoiceModel from "../../models/invoice-model";
import mongoose, { Model } from "mongoose";

class DocumentService implements IDocumentService {
  private textProcessorService: TextProcessingService;
  constructor() {
    this.textProcessorService = new TextProcessingService();
  }
  downlaod(filename: string, type: string): string {
    const safePath = path.normalize(
      path.join(path.join("uploads", type, filename))
    );
    return safePath;
  }
  async deleteDocs(entitities: { _id: string; type: string }[]) {
    let deleted = [];
    for (const entity of entitities) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        await EntityModel.deleteOne({ _id: entity._id }, { session });
        if (entity.type === "invoice") {
          await InvoiceModel.deleteMany({ entity: entity._id }, { session });
        }
        if (entity.type === "general") {
          await GeneralModel.deleteMany({ entity: entity._id }, { session });
        }
        await session.commitTransaction();
        session.endSession();
        deleted.push(entity._id);
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    }
    return deleted;
  }
  async getFiles(): Promise<any> {
    try {
      const entities = await EntityModel.aggregate([
        {
          $addFields: {
            path: {
              $concat: ["/", "$type", "/", "$name"],
            },
          },
        },
      ]);
      return entities;
    } catch (error) {
      throw error;
    }
  }
  async uploadDocument({
    mimeType,
    embeddings,
    chunks,
    fileName,
    description,
    typeOfDoc = "general",
    embeddingCreateService,
  }: {
    mimeType: string;
    fileName: string;
    description: string;
    embeddings: number[][];
    chunks: string[];
    typeOfDoc: string;
    embeddingCreateService: IEmbeddingCreateService;
  }) {
    const session = await EntityModel.startSession();
    try {
      await session.withTransaction(async () => {
        const newEntity = new EntityModel({
          mimeType,
          name: fileName,
          description,
          type: typeOfDoc,
        });
        await newEntity.save({ session });
        await embeddingCreateService.createEmbeddings(
          embeddings,
          newEntity.id,
          chunks,
          session
        );
        return newEntity;
      });
    } catch (err) {
      throw err;
    } finally {
      await session.endSession();
    }
  }

  loadDocumentProccessor(
    mimeType: string,
    typeOfDoc: string
  ): DocumentProcessor {
    const checker = `${mimeType}_${typeOfDoc}`;
    switch (checker) {
      case "application/pdf_general":
        return new GeneralProcessor();
      case "application/pdf_invoice":
        return new InvoiceProcessor();
      default:
        throw new Error("Unsupported document type");
    }
  }

  validateDocument(file: Express.Multer.File) {
    if (!file) throw new Error("No file provided");
    return { mimeType: file.mimetype };
  }

  makeDocumentModel(
    chunk: string,
    filename: string,
    embeddings: number[],
    entity: string
  ) {
    const content = this.textProcessorService.processChunk(chunk);
    return {
      content,
      filename,
      embeddings,
      entity,
    };
  }
}
export default DocumentService;
