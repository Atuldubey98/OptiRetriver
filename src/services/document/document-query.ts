import GeneralModel from "../../models/general-model";
import InvoiceModel from "../../models/invoice-model";

export interface DocumentQueryService {
  query: (queryEmbedding: number[], limit: number) => Promise<any>;
}
export class DocumentQueryFactory {
  public static getDocumentQueryService(type: string): DocumentQueryService {
    switch (type) {
      case "general":
        return new GeneralDocumentQueryService();
      case "invoice":
        return new InvoiceDocsQueryService();
      default:
        throw new Error("Unsupported document query service type");
    }
  }
}
export class InvoiceDocsQueryService implements DocumentQueryService {
  public async query(
    queryEmbedding: number[],
    limit: number = 10
  ): Promise<any> {
    const results = await InvoiceModel.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          queryVector: queryEmbedding,
          numCandidates: 10,
          path: "embeddings",
          limit,
        },
      },
      {
        $project: {
          _id: 0,
          content: 1,
          filename: 1,
          score: {
            $meta: "vectorSearchScore",
          },
          entity: 1,
        },
      },
      {
        $lookup: {
          from: "entities",
          localField: "entity",
          foreignField: "_id",
          as: "entity",
        },
      },
      {
        $unwind: "$entity",
      },
    ]);
    return results;
  }
}
export class GeneralDocumentQueryService implements DocumentQueryService {
  public async query(
    queryEmbedding: number[],
    limit: number = 10
  ): Promise<any> {
    const results = await GeneralModel.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          queryVector: queryEmbedding,
          numCandidates: 10,
          path: "embeddings",
          limit,
        },
      },
      {
        $project: {
          _id: 0,
          content: 1,
          filename: 1,
          score: {
            $meta: "vectorSearchScore",
          },
          entity: 1,
        },
      },
      {
        $lookup: {
          from: "entities",
          localField: "entity",
          foreignField: "_id",
          as: "entity",
        },
      },
      {
        $unwind: "$entity",
      },
    ]);
    return results;
  }
}
