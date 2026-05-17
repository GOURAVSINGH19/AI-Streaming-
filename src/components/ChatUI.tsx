"use client";

import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAIChatStream } from "@/hooks/useAiChatStream";

export default function ChatUI() {
  const [input, setInput] = useState("");
  const { messages, submitNewMessage, loading } = useAIChatStream({
    apiEndpoint: "/api/chat",
    systemPrompt: "You are a helpful assistant.",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput("");
    await submitNewMessage(trimmed);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <div className="scrollbar-hide flex-1 space-y-6 overflow-y-auto pb-24">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="rounded-2xl bg-zinc-200 p-4 dark:bg-zinc-800">
                <Bot className="h-12 w-12 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                How can I help you today?
              </h2>
              <p className="max-w-sm text-zinc-500">
                Start a conversation to see the power of streaming AI responses.
              </p>
            </motion.div>
          )}

          {messages.map((m, i) => (
            <motion.div
              key={`${m.role}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex-shrink-0 rounded-xl p-2 ${
                  m.role === "user"
                    ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                }`}
              >
                {m.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm md:text-base ${
                  m.role === "user"
                    ? "rounded-tr-none bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                    : "rounded-tl-none border border-zinc-200 bg-white text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                }`}
              >
                <div className="prose dark:prose-invert max-w-none break-words leading-relaxed text-inherit">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
                {loading && i === messages.length - 1 && m.role === "assistant" && (
                  <span className="ml-1 inline-block h-4 w-1.5 animate-pulse bg-zinc-400 align-middle" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-50 via-zinc-50/90 to-transparent p-4 dark:from-zinc-950 dark:via-zinc-950/90 md:p-8">
        <form onSubmit={handleSubmit} className="group relative mx-auto max-w-4xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="w-full rounded-2xl border border-zinc-200 bg-white py-4 pl-6 pr-16 text-zinc-800 shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-zinc-950/50 dark:focus:ring-zinc-100"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-zinc-900 p-2 text-zinc-50 transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
