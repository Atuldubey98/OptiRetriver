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
    
   const typeOfDoc = await this.completionService.complete(`
You are a strict text classifier.

Classify the user's message into one of two categories:

1. invoice — if the message talks about invoice, bill, quotation, receipt, purchase order, or payment.  
2. general — for anything else.

Reply with only one word: either invoice or general.  
Never explain or add any other text.  
If you start to explain, stop immediately and output only the single word.

Message: ${req.query?.search}

Final Answer (one word only):
`);

  
    
    const llmService = EmbeddingLoaderService.loadEmbeddingService("ollama");

    const queryEmbedding = await llmService.generateQueryEmbedding(search);
    const documentQueryService =
      DocumentQueryFactory.getDocumentQueryService(typeOfDoc.trim().toLocaleLowerCase());
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
  public async getFiles(_: Request, res: Response) {
    const entities = await this.documentService.getFiles();
    return res.status(200).json({ data: entities });
  }
  public async download(req: Request, res: Response) {
    const path = this.documentService.downlaod(
      req.params?.filename,
      req.params?.type
    );
    return res.status(200).json({
      data: path,
    });
  }
  public async deleteDocs(req: Request, res: Response) {
    const deleted = await this.documentService.deleteDocs(req.body);
    return res.status(200).json({
      data: deleted,
    });
  }
}

export default Controller;
