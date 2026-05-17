import type { ChatCompletionMessageParam } from "openai/resources";

/** In-memory job store (dev/single-instance). Use Redis/DB in production. */
export const jobs: Record<string, ChatCompletionMessageParam[]> = {};
