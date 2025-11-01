interface DocumentProcessor{
    parseBufferToChunks(buffer: Buffer) : Promise<string[]>;
}