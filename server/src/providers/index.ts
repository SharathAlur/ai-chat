import { createAnthropicProvider } from "./anthropic.js";
import { echoProvider } from "./echo.js";
import { createOpenAiProvider } from "./openai.js";
import type { ChatProvider } from "./types.js";

export function getProvider(name: string): ChatProvider {
  switch (name) {
    case "echo":
      return echoProvider;
    case "anthropic":
      return createAnthropicProvider();
    case "openai":
      return createOpenAiProvider();
    default:
      throw new Error(`Unknown AI_PROVIDER: '${name}`);
  }
}
