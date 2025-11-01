interface DocumentProcessor{
    parseBufferToText(buffer: Buffer) : Promise<string>;
}