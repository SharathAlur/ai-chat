import OpenAI from "openai";
import type { ChatProvider } from "./types.js";
import { requireEnv } from "../helper.js";

const client = new OpenAI();
export const openAiProvider: ChatProvider = {
  name: "openai",
  async complete(messages) {
    const model = requireEnv("OPENAI_MODEL");
    const response = await client.responses.create({
      model,
      input: messages,
    });
    console.log(response);
    return response.output_text;
  },
  async *stream() {
    throw new Error("stream not implemented yet");
  },
};
