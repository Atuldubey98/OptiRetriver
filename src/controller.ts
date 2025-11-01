import { Request, Response } from "express";
import { DocumentQueryFactory } from "./services/document/document-query";
import DocumentService from "./services/document/document-service";
import DocumentProcessingService from "./services/document/document-service-impl";
import EmbeddingLoaderService from "./services/embedding/embedding-loader-service";
import { readFile } from "fs/promises";

class Controller {
  private documentService: DocumentService;
  constructor() {
    this.documentService = new DocumentProcessingService();
  }
  public getHealth(_: Request, res: Response) {
    return res.send("Hello, World!");
  }
  public async upload(req: Request, res: Response) {
    const file = req.file;
    if (!file) throw new Error("No file provided");
    const typeOfDoc = (req.query?.type as string) || "general";
    const { mimeType } = this.documentService.validateDocument(
      file as Express.Multer.File
    );
    const processor = this.documentService.loadDocumentProccessor(
      mimeType,
      typeOfDoc
    );
    const buffer = await readFile(file?.path);
    const chunks = await processor.parseBufferToChunks(buffer);
    const llmService = EmbeddingLoaderService.loadEmbeddingService("ollama");
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
    const documentQueryService =
      DocumentQueryFactory.getDocumentQueryService(typeOfDoc);
    const results = await documentQueryService.query(queryEmbedding, 10);
    return res.json({
      data: results,
    });
  }
}

export default Controller;
