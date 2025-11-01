import EntityModel from "../../models/entity-model";
import TextProcessingService from "../chunk/text-processor-service";
import { IEmbeddingCreateService } from "../embedding/embedding-create";
import IDocumentService from "./document-service";
import GeneralProcessor from "./general-processor";
import { InvoiceProcessor } from "./invoice-processor";

class DocumentService implements IDocumentService {
  private textProcessorService: TextProcessingService;
  constructor() {
    this.textProcessorService = new TextProcessingService();
  }
  async uploadDocument({
    mimeType,
    embeddings,
    chunks,
    fileName,
    description,
    embeddingCreateService,
  }: {
    mimeType: string;
    fileName: string;
    description: string;
    embeddings: number[][];
    chunks: string[];
    embeddingCreateService: IEmbeddingCreateService;
  }) {
    const session = await EntityModel.startSession();
    try {
      await session.withTransaction(async () => {
        const newEntity = new EntityModel({
          mimeType,
          name: fileName,
          description,
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
