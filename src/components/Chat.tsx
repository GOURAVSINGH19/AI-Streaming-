"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  AudioLines,
  ChevronDown,
  Globe,
  Image,
  Loader2,
  Mic,
  Pencil,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";
import { useAIChatStream } from "@/hooks/useAiChatStream";
import Message from "@/components/Message";
import StreamingMessage from "@/components/StreamingMessage";

const QUICK_ACTIONS = [
  { label: "Create an image", icon: Image },
  { label: "Write or edit", icon: Pencil },
  { label: "Look something up", icon: Globe },
] as const;

export default function Chat() {
  const formId = useId();
  const [input, setInput] = useState("");
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const { messages, submitNewMessage, loading, resetChat } = useAIChatStream({
    apiEndpoint: "/api/chat",
    systemPrompt: "You are a helpful assistant.",
  });

  const hasMessages = messages.length > 0;

  const scrollToBottom = useCallback(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || loading) return;
      setInput("");
      await submitNewMessage(trimmed);
    },
    [input, loading, submitNewMessage],
  );

  const startNewChat = () => {
    resetChat();
    setInput("");
  };

  const inputBar = (
    <form
      id={formId}
      onSubmit={onSubmit}
      className={`mx-auto w-full max-w-3xl ${hasMessages ? "px-4 pb-6" : ""}`}
    >
      <label htmlFor={`${formId}-input`} className="sr-only">
        Ask anything
      </label>
      <div className="flex items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-900 px-4 py-3 shadow-lg">
        <button
          type="button"
          className="shrink-0 text-zinc-400 transition-colors hover:text-zinc-200"
          aria-label="Add attachment"
        >
          <Plus size={20} strokeWidth={1.75} />
        </button>
        <input
          id={`${formId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything"
          disabled={loading}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-zinc-100 outline-none placeholder:text-zinc-500"
        />
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            aria-label="Use microphone"
          >
            <Mic size={20} strokeWidth={1.75} />
          </button>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-opacity hover:bg-zinc-200 disabled:opacity-40"
            aria-label="Send message"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <AudioLines size={18} strokeWidth={2} />}
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="flex h-full min-h-0 w-screen bg-black text-zinc-100">
      <div className="mx-auto flex min-h-0 min-w-0 max-w-screen-xl flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={startNewChat}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-lg font-medium text-zinc-100 transition-colors hover:bg-zinc-900"
          >
            ChatGPT
            <ChevronDown size={18} className="text-zinc-500" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:bg-zinc-900"
            >
              <Sparkles size={14} className="text-violet-400" />
              Upgrade
            </button>
            <button
              type="button"
              aria-label="Settings"
              className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
            >
              <Settings size={20} strokeWidth={1.75} />
            </button>
          </div>
        </header>

        {hasMessages ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
              <div className="mx-auto flex max-w-3xl flex-col gap-8">
                {messages.map((m, i) => {
                  const key = `${m.role}-${i}`;
                  const isStreaming =
                    loading && i === messages.length - 1 && m.role === "assistant";

                  if (m.role === "user") {
                    return <Message key={key} role="user" content={m.content} />;
                  }
                  if (isStreaming) {
                    return <StreamingMessage key={key} content={m.content} />;
                  }
                  return <Message key={key} role="assistant" content={m.content} />;
                })}
                <div ref={scrollAnchorRef} />
              </div>
            </div>
            {inputBar}
          </>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-8">
            <h1 className="mb-10 text-center text-3xl font-normal tracking-tight text-zinc-100 md:text-4xl">
              What&apos;s on the agenda today?
            </h1>

            {inputBar}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setInput(label)}
                  className="flex items-center gap-2 rounded-full border border-zinc-700/80 bg-transparent px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-900"
                >
                  <Icon size={16} strokeWidth={1.75} className="text-zinc-400" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
