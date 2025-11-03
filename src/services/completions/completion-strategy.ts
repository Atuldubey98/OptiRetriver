export interface CompletionStrategy {
  complete(content: string): Promise<string>;
  streamComplete(prompt: string, onChunk: (text: string) => void) : Promise<void>
}

