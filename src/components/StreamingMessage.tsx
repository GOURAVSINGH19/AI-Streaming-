"use client";

import Message from "@/components/Message";

type Props = {
  content: string;
  error?: string | null;
};

export default function StreamingMessage({ content, error }: Props) {
  return (
    <div className="space-y-1">
      <Message role="assistant" content={content || "\u00a0"} />
      {error ? <p className="pl-12 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
