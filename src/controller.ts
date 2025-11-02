import { Request, Response } from "express";
import { readFile } from "fs/promises";
import { DocumentQueryFactory } from "./services/document/document-query";
import DocumentService from "./services/document/document-service";
import DocumentProcessingService from "./services/document/document-service-impl";
import EmbeddingLoaderService from "./services/embedding/embedding-loader-service";
import { PromptFactory } from "./services/prompts/prompt-service";
import CompletionService from "./services/completions/completion-service";

class Controller {
  private readonly documentService: DocumentService;
  private readonly completionService: CompletionService;
  constructor() {
    this.documentService = new DocumentProcessingService();
    this.completionService = new CompletionService();
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
      typeOfDoc,
      embeddingCreateService:
        EmbeddingLoaderService.getEmbeddingCreateService(typeOfDoc),
      
    });
    return res.send({ message: "File uploaded successfully" });
  }
  public async query(req: Request, res: Response) {
    const results = await this.getResults(req);
    return res.json({
      data: results,
    });
  }
  private async getResults(req: Request) {
    const search = req.query?.search as string;
    const typeOfDoc = (req.query?.type as string) || "general";    
    const llmService = EmbeddingLoaderService.loadEmbeddingService("ollama");
    const queryEmbedding = await llmService.generateQueryEmbedding(search);
    const documentQueryService =
      DocumentQueryFactory.getDocumentQueryService(typeOfDoc);
    const results = await documentQueryService.query(queryEmbedding, 10);
    return results;
  }

  public async response(req: Request, res: Response) {
    const results = await this.getResults(req);
    const typeOfDoc = (req.query?.type as string) || "general";

    const chunks: string[] = results.map(
      (result: { content: string; score: number }) => result.content
    );
    const promptService = PromptFactory.getPromptFactory(typeOfDoc);
    const prompt = promptService.makePrompt(
      chunks,
      req.query?.search as string
    );
    const response = await this.completionService.complete(prompt);
    return res.status(200).json({ data: response });
  }
}

export default Controller;
