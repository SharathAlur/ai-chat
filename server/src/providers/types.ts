export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatProvider {
  name: string;
  complete(messages: ChatMessage[]): Promise<string>;
  stream(messages: ChatMessage[]): AsyncIterable<string>;
}
