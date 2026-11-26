import OpenAI from "openai";
import type { ChatProvider } from "./types.js";
import { requireEnv } from "../helper.js";

export function createOpenAiProvider(): ChatProvider {
  const client = new OpenAI();
  const model = requireEnv("OPENAI_MODEL");
  return {
    name: "openai",
    async complete(messages) {
      const response = await client.responses.create({
        model,
        input: messages,
      });
      return response.output_text;
    },
    async *stream(messages, signal) {
      const stream = await client.responses.create(
        {
          model,
          input: messages,
          stream: true,
        },
        { signal },
      );
      for await (const chunk of stream) {
        if (chunk.type === "response.output_text.delta") {
          yield chunk.delta;
        }
      }
    },
  };
}
