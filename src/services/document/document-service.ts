import { IEmbeddingCreateService } from "../embedding/embedding-create";

interface IDocumentService {
  validateDocument(file: Express.Multer.File): { mimeType: string };
  loadDocumentProccessor(
    mimeType: string,
    typeOfDoc: string
  ): DocumentProcessor;
  uploadDocument(props: {
    mimeType: string;
    fileName: string;
    description: string;
    embeddings: number[][];
    chunks: string[];
    typeOfDoc : string;
    embeddingCreateService: IEmbeddingCreateService;
  }): Promise<void>;
}

export default IDocumentService;
