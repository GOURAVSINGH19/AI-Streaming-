"use client";

import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";

type Role = "user" | "assistant";

type Props = {
  role: Role;
  content: string;
};

export default function Message({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex items-start gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-zinc-700 text-zinc-200" : "bg-zinc-800 text-zinc-300"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={`max-w-[min(100%,42rem)] flex-1 text-[15px] leading-relaxed ${isUser ? "text-right" : ""}`}>
        {isUser ? (
          <p className="whitespace-pre-wrap break-words text-zinc-100">{content}</p>
        ) : (
          <div className="markdown-body break-words text-zinc-300">
            <ReactMarkdown
              components={{
                code(props) {
                  const { children, className, ...rest } = props;
                  const inline = !className?.includes("language-");
                  return inline ? (
                    <code className="rounded bg-zinc-800 px-1 py-0.5 font-mono text-[0.9em]" {...rest}>
                      {children}
                    </code>
                  ) : (
                    <pre className="my-2 overflow-x-auto rounded-lg bg-zinc-900 p-3 text-zinc-200">
                      <code className={`font-mono text-[13px] ${className ?? ""}`} {...rest}>
                        {children}
                      </code>
                    </pre>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
