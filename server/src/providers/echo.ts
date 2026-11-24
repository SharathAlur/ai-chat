import type { ChatMessage, ChatProvider } from "./types.js";
function buildReply(messages: ChatMessage[]) {
  return `Server got ${messages.length} messages. You said: ${messages.at(-1)?.content}`;
}
export const echoProvider: ChatProvider = {
  name: "echo",
  async complete(messages: ChatMessage[]) {
    let text = "";
    for await (const chunk of echoProvider.stream(messages)) text += chunk;
    return text;
  },
  async *stream(messages) {
    const words = buildReply(messages).split(" ");
    for (const word of words) {
      console.log("generating:", word); // to see Ctrl+C stopping generation
      await new Promise((resolve) => setTimeout(resolve, 100));
      yield word + " ";
    }
  },
};
