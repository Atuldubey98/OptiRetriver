import { Request, Response } from "express";
import GeneralModel from "./models/general-model";
import TextProcessingService from "./services/chunk/text-processor-service";
import DocumentService from "./services/document/document-service";
import DocumentProcessingService from "./services/document/document-service-impl";
import EmbeddingLoaderService from "./services/embedding/embedding-loader-service";
import { DocumentQueryFactory } from "./services/document/document-query";

class Controller {
  private documentService: DocumentService;
  private textProcessingService: TextProcessingService;
  constructor() {
    this.documentService = new DocumentProcessingService();
    this.textProcessingService = new TextProcessingService();
  }
  public getHealth(_: Request, res: Response) {
    return res.send("Hello, World!");
  }
  public async upload(req: Request, res: Response) {
    const file = req.file;
    const typeOfDoc = req.body?.type || "general";
    const { mimeType } = this.documentService.validateDocument(
      file as Express.Multer.File
    );
    const processor = this.documentService.loadDocumentProccessor(mimeType);
    const text = await processor.parseBufferToText(file?.buffer as Buffer);
    const llmService = EmbeddingLoaderService.loadEmbeddingService("ollama");
    
    const chunks = this.textProcessingService.getChunks(text);
    const embeddings = await llmService.generateEmbeddings(chunks);
    await this.documentService.uploadDocument({
      mimeType,
      fileName: file?.originalname || "",
      description: req.body?.description,
      embeddings,
      chunks,
      embeddingCreateService:
        EmbeddingLoaderService.getEmbeddingCreateService(typeOfDoc),
    });
    return res.send({ message: "File uploaded successfully" });
  }
  public async query(req: Request, res: Response) {
    const search = req.query?.search as string;
    const typeOfDoc = (req.query?.type as string) || "general";
    const llmService = EmbeddingLoaderService.loadEmbeddingService("ollama");
    const queryEmbedding = await llmService.generateQueryEmbedding(search);
    const documentQueryService = DocumentQueryFactory.getDocumentQueryService(typeOfDoc);
    const results = await documentQueryService.query(queryEmbedding, 10);
    return res.json(results);
  }
}

export default Controller;
