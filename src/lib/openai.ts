import OpenAI from "openai";

export function getOpenAIApiKey(): string | undefined {
  const key = process.env.OPENAI_API_KEY ?? process.env.OPEN_API;
  return key?.replace(/^["'\s]+|["'\s]+$/g, "");
}

export function getOpenAIBaseURL(apiKey: string): string | undefined {
  if (process.env.OPENAI_BASE_URL) {
    return process.env.OPENAI_BASE_URL;
  }
  if (apiKey.startsWith("xai-")) {
    return "https://api.x.ai/v1";
  }
  return undefined;
}

export function getDefaultModel(apiKey: string): string {
  if (process.env.OPENAI_MODEL) {
    return process.env.OPENAI_MODEL;
  }
  if (apiKey.startsWith("xai-")) {
    return "grok-2-latest";
  }
  return "gpt-4o-mini";
}

export function createOpenAIClient(): OpenAI {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const baseURL = getOpenAIBaseURL(apiKey);

  return new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
  });
}
