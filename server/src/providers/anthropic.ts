import Anthropic from "@anthropic-ai/sdk";
import type { ChatProvider } from "./types.js";
import { requireEnv } from "../helper.js";

export function createAnthropicProvider(): ChatProvider {
  const client = new Anthropic();
  const model = requireEnv("ANTHROPIC_MODEL");
  return {
    name: "anthropic",
    async complete(messages) {
      const response = await client.messages.create({
        model,
        max_tokens: 1024,
        // stream: true,
        messages: messages,
      });
      const textResponse = response.content.filter((c) => c.type === "text");
      return textResponse.map((t) => t.text).join("");
    },
    async *stream(messages, signal) {
      const stream = await client.messages.create(
        {
          model,
          max_tokens: 1024,
          stream: true,
          messages,
        },
        { signal },
      );
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          yield event.delta.text;
        }
      }
    },
  };
}
