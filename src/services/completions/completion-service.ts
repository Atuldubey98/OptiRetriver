import EmbeddingLoaderService from "../embedding/embedding-loader-service";

export default class CompletionService{
   constructor(){}
   async complete(prompt : string){
    const completionService = EmbeddingLoaderService.loadResponseService("ollama");
    const response = await completionService.complete(prompt);
    return response;
   }
}