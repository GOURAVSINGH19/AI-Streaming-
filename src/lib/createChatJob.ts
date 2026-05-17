import { v4 as uuidv4 } from "uuid";
import type { NextRequest } from "next/server";
import type { ChatCompletionMessageParam } from "openai/resources";

type CreateChatJobProps = {
  request: NextRequest;
  jobs: Record<string, ChatCompletionMessageParam[]>;
};

export async function createChatJob({
  request,
  jobs,
}: CreateChatJobProps): Promise<Response> {
  let body: { messages?: ChatCompletionMessageParam[] };
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { messages } = body;

  if (!Array.isArray(messages)) {
    return new Response('"messages" must be an array passed in the body', {
      status: 400,
    });
  }

  const jobId = uuidv4();
  jobs[jobId] = messages;

  return Response.json(jobId);
}
