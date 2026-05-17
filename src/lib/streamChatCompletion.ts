import { NextRequest, NextResponse } from "next/server";
import type OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources";

export type StreamChatCompletionProps = {
  request: NextRequest;
  jobs: Record<string, ChatCompletionMessageParam[]>;
  client: OpenAI;
  model: string;
};

function sseLine(payload: object): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
}

const sseHeaders = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
};

export async function streamChatCompletion({
  request,
  jobs,
  client,
  model,
}: StreamChatCompletionProps): Promise<NextResponse> {
  const jobId = request.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return new NextResponse('"jobId" missing in searchParams', { status: 400 });
  }

  const messages = jobs[jobId];
  delete jobs[jobId];

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (payload: object) => controller.enqueue(sseLine(payload));

      try {
        if (!messages) {
          send({
            content: "[DONE]",
            error: "Job not found or expired. Try sending again.",
          });
          return;
        }

        const chatStream = await client.chat.completions.create({
          model,
          messages,
          stream: true,
        });

        for await (const chunk of chatStream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            send({ content });
          }
        }

        send({ content: "[DONE]" });
      } catch (error) {
        console.error("Error streaming chat completion:", error);
        const message =
          error instanceof Error ? error.message : "Stream failed";
        send({ content: "[DONE]", error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, { headers: sseHeaders });
}
