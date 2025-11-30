export const CHAT_QUERY_KEYS = {
  all: ["chats"] as const,
  chats: (params?: unknown) => ["chats", params] as const,
  chat: (id: string) => ["chat", id] as const,
  messages: (params?: unknown) => ["messages", params] as const,
  message: (id: string) => ["message", id] as const,
  messagesByChat: (chatId: string, params?: unknown) => 
    ["messages", "chat", chatId, params] as const,
  messagesByChatId: (chatId: string, params?: unknown) => 
    ["messages", "chat", chatId, params] as const,
} as const;

export const DEFAULT_MESSAGE_LIMIT = 50;
export const DEFAULT_CHAT_STATUS = "Online";
