export interface CompletionStrategy{
    complete(content : string) : string; 
}