interface EmbeddingStrategy {
    generateEmbeddings(text: string[]) : Promise<number[][]>;
    generateQueryEmbedding(text: string) : Promise<number[]>;
}

export default EmbeddingStrategy;