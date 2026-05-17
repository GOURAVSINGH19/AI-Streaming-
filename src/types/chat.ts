export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type UseAIChatStreamProps = {
  apiEndpoint: string;
  systemPrompt: string;
};

export type UseAIChatStreamReturn = {
  messages: ChatMessage[];
  submitNewMessage: (text: string) => Promise<void>;
  loading: boolean;
  resetChat: () => void;
};
