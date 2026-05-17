"use client";

import { useCallback, useState } from "react";
import type { ChatMessage, UseAIChatStreamProps, UseAIChatStreamReturn } from "../types/chat";

function messageContent(msg: ChatMessage): string {
  return typeof msg.content === "string" ? msg.content : "";
}

export function useAIChatStream({
  apiEndpoint,
  systemPrompt,
}: UseAIChatStreamProps): UseAIChatStreamReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "system", content: systemPrompt },
  ]);
  const [loading, setLoading] = useState(false);

  const resetChat = useCallback(() => {
    setMessages([{ role: "system", content: systemPrompt }]);
    setLoading(false);
  }, [systemPrompt]);

  const submitNewMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    setLoading(true);

    const newMessage: ChatMessage = { role: "user", content: trimmed };
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to create chat job:", errText);
        setLoading(false);
        return;
      }

      const jobId = await res.json();
      const eventSource = new EventSource(`${apiEndpoint}?jobId=${jobId}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data) as { content?: string; error?: string };

        if (data.error) {
          console.error("Stream error:", data.error);
        }

        if (data.content !== "[DONE]") {
          setMessages((prevMessages) => {
            const last = prevMessages[prevMessages.length - 1];
            if (last?.role === "assistant") {
              return [
                ...prevMessages.slice(0, -1),
                {
                  role: "assistant",
                  content: messageContent(last) + (data.content ?? ""),
                },
              ];
            }
            return [...prevMessages, { role: "assistant", content: data.content ?? "" }];
          });
        } else {
          eventSource.close();
          setLoading(false);
          if (data.error) {
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  {
                    role: "assistant",
                    content: `Error: ${data.error}`,
                  },
                ];
              }
              return [
                ...prev,
                {
                  role: "assistant",
                  content: `Error: ${data.error ?? "Something went wrong. Check your API key and model."}`,
                },
              ];
            });
          }
        }

        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
        setLoading(false);
      };
    } catch (error) {
      console.error("Chat request failed:", error);
      setLoading(false);
    }
  };

  return { messages: messages.slice(1), submitNewMessage, loading, resetChat };
}
