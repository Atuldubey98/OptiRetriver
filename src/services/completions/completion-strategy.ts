export interface CompletionStrategy {
  complete(content: string): Promise<string>;
}

