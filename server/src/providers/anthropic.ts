import Anthropic from "@anthropic-ai/sdk";
import type { ChatProvider } from "./types.js";
import { requireEnv } from "../helper.js";

const client = new Anthropic();

export const anthropicProvider: ChatProvider = {
  name: "anthropic",
  async complete(messages) {
    const model = requireEnv("ANTHROPIC_MODEL");
    const response = await client.messages.create({
      model,
      max_tokens: 1024,
      // stream: true,
      messages: messages,
    });
    console.log(response);
    const textResponse = response.content.filter((c) => c.type === "text");
    console.log(textResponse);
    return textResponse.map((t) => t.text).join("");
  },
  async *stream() {
    throw new Error("stream not implemented yet");
  },
};
