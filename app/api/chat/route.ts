import type { NextRequest } from "next/server";
import { createChatJob } from "@/lib/createChatJob";
import {
  createOpenAIClient,
  getDefaultModel,
  getOpenAIApiKey,
} from "@/lib/openai";
import { jobs } from "@/lib/jobs";
import { streamChatCompletion } from "@/lib/streamChatCompletion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!getOpenAIApiKey()) {
    return new Response("OPENAI_API_KEY is not set", { status: 500 });
  }
  return createChatJob({ request, jobs });
}

export async function GET(request: NextRequest) {
  if (!getOpenAIApiKey()) {
    return new Response("OPENAI_API_KEY is not set", { status: 500 });
  }

  const apiKey = getOpenAIApiKey()!;
  const client = createOpenAIClient();
  const model = getDefaultModel(apiKey);

  return streamChatCompletion({
    request,
    jobs,
    client,
    model,
  });
}
