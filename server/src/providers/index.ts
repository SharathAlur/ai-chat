import { anthropicProvider } from "./anthropic.js";
import { echoProvider } from "./echo.js";
import { openAiProvider } from "./openai.js";
import type { ChatProvider } from "./types.js";

export function getProvider(name: string): ChatProvider {
  switch (name) {
    case "echo":
      return echoProvider;
    case "anthropic":
      return anthropicProvider;
    case "openai":
      return openAiProvider;
    default:
      throw new Error(`Unknown AI_PROVIDER: '${name}`);
  }
}
