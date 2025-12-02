"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { indexedDBService } from "@/lib/indexeddb";
import { Message, MessageWithSender } from "@/features/chat/interface/message.interface";
import { ChatWithParticipants } from "@/features/chat/interface/chat.interface";
import { CHAT_QUERY_KEYS } from "@/features/chat/constants";
import { toast } from "react-toastify";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isSyncing: boolean;
  sendMessage: (data: SendMessageData) => void;
}

interface SendMessageData {
  chatId: string;
  recipientId: string;
  content: string;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isSyncing: false,
  sendMessage: () => {},
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const pendingMessagesRef = useRef<Map<string, string>>(new Map());
  const currentProfileId = session?.user?.profile?.id;
  const currentProfileName =
    session?.user?.profile?.name ?? session?.user?.name ?? session?.user?.email ?? "Você";
  const currentProfilePhoto = session?.user?.profile?.photoUrl ?? null;

  const queryClientRef = useRef(queryClient);
  useEffect(() => { queryClientRef.current = queryClient; }, [queryClient]);

  const getLastCachedMessageTimestamp = useCallback(() => {
    const queries = queryClientRef.current.getQueriesData<{ data?: MessageWithSender[] }>(
      {
        predicate: (query) => {
          if (!Array.isArray(query.queryKey)) return false;
          const [scope, type] = query.queryKey;
          return scope === "messages" && type === "chat";
        },
      }
    );

    let latest: Date | undefined;
    queries.forEach(([, value]) => {
      const messages = value?.data ?? [];
      messages.forEach((message) => {
        const createdAt = new Date(message.createdAt);
        if (!latest || createdAt > latest) {
          latest = createdAt;
        }
      });
    });

    return latest;
  }, []);

  const syncChatPreviewWithMessage = useCallback(
    (message: MessageWithSender) => {
      let chatFound = false;

      const chatQueries = queryClientRef.current.getQueriesData<
        ChatWithParticipants[] | undefined
      >({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "chats",
      });

      chatQueries.forEach(([queryKey, chats]) => {
        if (!Array.isArray(chats)) return;

        const chatIndex = chats.findIndex((chat) => chat.id === message.chatId);
        if (chatIndex === -1) return;

        chatFound = true;
        const nextChats = [...chats];
        const target = nextChats[chatIndex];
        nextChats[chatIndex] = {
          ...target,
          lastMessage: {
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            createdAt:
              typeof message.createdAt === "string"
                ? new Date(message.createdAt)
                : message.createdAt,
          },
        };

        queryClientRef.current.setQueryData(queryKey, nextChats);
      });

      return chatFound;
    },
    [],
  );

  const updateMessageStatus = useCallback(
    async (
      clientRequestId?: string | null,
      status: Message["status"] = "sent",
      chatId?: string,
    ) => {
      if (!clientRequestId) return;

      const resolvedChatId = chatId ?? pendingMessagesRef.current.get(clientRequestId);
      if (!resolvedChatId) return;

      let updatedMessage: MessageWithSender | undefined;
      // CORREÇÃO AQUI: Mudado de {} para undefined
      queryClientRef.current.setQueryData<
        { data: MessageWithSender[]; total: number } | undefined
      >(CHAT_QUERY_KEYS.messagesByChatId(resolvedChatId, undefined), (oldData) => {
        if (!oldData?.data) return oldData;

        const nextMessages = oldData.data.map((message) => {
          if (message.clientRequestId === clientRequestId) {
            updatedMessage = { ...message, status };
            return updatedMessage;
          }
          return message;
        });

        if (!updatedMessage) {
          return oldData;
        }

        return { data: nextMessages, total: nextMessages.length };
      });

      if (updatedMessage) {
        await indexedDBService.saveMessage(updatedMessage).catch(() => undefined);
      }
    },
    [],
  );

  const removePendingMessage = useCallback(
    async (clientRequestId?: string | null, chatId?: string) => {
      if (!clientRequestId) return;

      const resolvedChatId = chatId ?? pendingMessagesRef.current.get(clientRequestId);
      if (!resolvedChatId) return;

      let removed = false;
      // CORREÇÃO AQUI: Mudado de {} para undefined
      queryClientRef.current.setQueryData<
        { data: MessageWithSender[]; total: number } | undefined
      >(CHAT_QUERY_KEYS.messagesByChatId(resolvedChatId, undefined), (oldData) => {
        if (!oldData?.data) return oldData;

        const filteredMessages = oldData.data.filter((message) => {
          const shouldRemove = message.clientRequestId === clientRequestId;
          if (shouldRemove) {
            removed = true;
          }
          return !shouldRemove;
        });

        if (!removed) {
          return oldData;
        }

        return { data: filteredMessages, total: filteredMessages.length };
      });

      pendingMessagesRef.current.delete(clientRequestId);
      await indexedDBService.deleteMessage(clientRequestId).catch(() => undefined);
    },
    [],
  );

  const normalizeMessage = useCallback(
    (message: MessageWithSender, status: Message["status"] = "sent") => ({
      ...message,
      createdAt:
        typeof message.createdAt === "string"
          ? message.createdAt
          : new Date(message.createdAt).toISOString(),
      updatedAt:
        typeof message.updatedAt === "string"
          ? message.updatedAt
          : new Date(message.updatedAt).toISOString(),
      status,
    }),
    []
  );

  const upsertMessagesForChat = useCallback(
    (chatId: string, incomingMessages: MessageWithSender[]) => {
      if (!chatId || incomingMessages.length === 0) return;

      // CORREÇÃO AQUI: Mudado de {} para undefined
      queryClientRef.current.setQueryData<
        { data: MessageWithSender[]; total: number } | undefined
      >(CHAT_QUERY_KEYS.messagesByChatId(chatId, undefined), (oldData) => {
        const currentMessages = [...(oldData?.data ?? [])];

        incomingMessages.forEach((incoming) => {
          const requestMatchIndex = incoming.clientRequestId
            ? currentMessages.findIndex(
                (existing) =>
                  existing.clientRequestId &&
                  existing.clientRequestId === incoming.clientRequestId,
              )
            : -1;

          if (requestMatchIndex !== -1) {
            currentMessages[requestMatchIndex] = incoming;
            return;
          }

          const idMatchIndex = currentMessages.findIndex(
            (existing) => existing.id === incoming.id,
          );

          if (idMatchIndex !== -1) {
            currentMessages[idMatchIndex] = incoming;
          } else {
            currentMessages.push(incoming);
          }
        });

        currentMessages.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

        return { data: currentMessages, total: currentMessages.length };
      });
    },
    []
  );
  const handleMissedMessages = useCallback(
    async (messages: MessageWithSender[]) => {
      if (messages.length === 0) {
        setIsSyncing(false);
        return;
      }

      try {
        const normalizedMessages = messages.map((msg) =>
          normalizeMessage(msg, "sent"),
        );
        const BATCH_SIZE = 20;
        for (let i = 0; i < normalizedMessages.length; i += BATCH_SIZE) {
          const batch = normalizedMessages.slice(i, i + BATCH_SIZE);
          await indexedDBService.saveMessages(batch);

          const grouped = batch.reduce<Record<string, MessageWithSender[]>>(
            (acc, current) => {
              if (!acc[current.chatId]) {
                acc[current.chatId] = [];
              }
              acc[current.chatId].push(current);
              return acc;
            },
            {}
          );

          Object.entries(grouped).forEach(([chatId, chatMessages]) => {
            upsertMessagesForChat(chatId, chatMessages);
          });

          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        const lastMessage = normalizedMessages[normalizedMessages.length - 1];
        if (lastMessage?.createdAt) {
          await indexedDBService.setLastSyncDate(new Date(lastMessage.createdAt));
        }

        void queryClientRef.current.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.all });
        toast.success(`${messages.length} mensagens sincronizadas`);
      } catch (error) {
        console.error("Error syncing messages:", error);
        toast.error("Erro ao sincronizar mensagens");
      } finally {
        setIsSyncing(false);
      }
    },
    [normalizeMessage, upsertMessagesForChat]
  );

  const handleNewMessage = useCallback(
    async (message: MessageWithSender) => {
      try {
        const normalizedMessage = normalizeMessage(message, "sent");

        if (normalizedMessage.clientRequestId) {
          pendingMessagesRef.current.delete(normalizedMessage.clientRequestId);
          await indexedDBService
            .deleteMessage(normalizedMessage.clientRequestId)
            .catch(() => undefined);
        }

        upsertMessagesForChat(normalizedMessage.chatId, [normalizedMessage]);
        await indexedDBService.saveMessage(normalizedMessage);
        await indexedDBService.setLastSyncDate(
          new Date(normalizedMessage.createdAt),
        );
        const chatExistsInCache = syncChatPreviewWithMessage(normalizedMessage);
        if (!chatExistsInCache) {
          void queryClientRef.current.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.chats() });
        }
        if (normalizedMessage.senderId !== currentProfileId) {
          toast.info("Nova mensagem recebida");
        }
      } catch (error) {
        console.error("Error handling new message:", error);
      }
    },
    [
      normalizeMessage,
      upsertMessagesForChat,
      currentProfileId,
      syncChatPreviewWithMessage,
    ],
  );

  const handleMessageSent = useCallback(
    (payload: { chatId?: string; clientRequestId?: string | null }) => {
      if (!payload?.clientRequestId) return;
      void updateMessageStatus(
        payload.clientRequestId,
        "sent",
        payload.chatId ?? undefined,
      );
    },
    [updateMessageStatus],
  );

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) {
      return;
    }

    let socketInstance: Socket | null = null;
    let isMounted = true; 

    const initSocket = async () => {
      try {
        const cachedTimestamp = getLastCachedMessageTimestamp();
        const lastSyncDate = cachedTimestamp ?? (await indexedDBService.getLastSyncDate());
        
        
        if (!isMounted) return;

        const socketUrl = "http://localhost:8080";
        
        socketInstance = io(socketUrl, {
          auth: { token: session.accessToken },
          query: { lastMessageCreatedAt: lastSyncDate?.toISOString() || "" },
          transports: ["websocket"], 
          reconnection: true,
        });

        socketInstance.on("connect", () => {
          if (isMounted) {
            setIsConnected(true);
            setIsSyncing(true);
            
          }
        });

        socketInstance.on("disconnect", () => {
          if (isMounted) {
            setIsConnected(false);
            setIsSyncing(false);
          }
        });

        socketInstance.on("missedMessages", handleMissedMessages);
        socketInstance.on("newMessage", handleNewMessage);
        socketInstance.on("messageSent", handleMessageSent);

        socketInstance.on("syncComplete", (data: { total: number }) => {

          if (isMounted) setIsSyncing(false);
        });

        socketInstance.on(
          "error",
          (error: { error: string; clientRequestId?: string | null; chatId?: string }) => {
            console.error("Socket error:", error);
            if (error.clientRequestId) {
              void removePendingMessage(error.clientRequestId, error.chatId ?? undefined);
            }
            if (isMounted) toast.error(error.error || "Erro de conexão");
          },
        );

        socketInstance.on("connect_error", (err) => {
             console.error("Connection Error:", err.message);
             if (isMounted) setIsConnected(false);
        });

        if (isMounted) {
          setSocket(socketInstance);
        }

        const localMessages = await indexedDBService.getAllMessages();
        if (localMessages.length > 0 && isMounted) {
          const groupedByChat = localMessages.reduce(
            (acc, msg) => {
              if (!acc[msg.chatId]) acc[msg.chatId] = [];
              acc[msg.chatId].push(normalizeMessage(msg, "sent"));
              return acc;
            },
            {} as Record<string, MessageWithSender[]>
          );

          Object.entries(groupedByChat).forEach(([chatId, messages]) => {
            upsertMessagesForChat(chatId, messages);
          });
        }

      } catch (e) {
        console.error("Setup failed", e);
      }
    };

    void initSocket();

    return () => {
      isMounted = false;
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance.removeAllListeners();
      }
    };
    
  }, [
    session,
    status,
    handleMissedMessages,
    handleNewMessage,
    handleMessageSent,
    getLastCachedMessageTimestamp,
    normalizeMessage,
    upsertMessagesForChat,
    removePendingMessage,
  ]); 

  const sendMessage = useCallback(
    (data: SendMessageData) => {
      if (!socket || !isConnected) {
        toast.error("Sem conexão com o servidor");
        return;
      }

      if (!currentProfileId) {
        toast.error("Perfil não encontrado");
        return;
      }

      if (!data.recipientId) {
        toast.error("Selecione um destinatário");
        return;
      }

      if (!data.chatId) {
        toast.error("Selecione uma conversa");
        return;
      }

      const trimmedContent = data.content?.trim();
      if (!trimmedContent) {
        return;
      }

      const clientRequestId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${currentProfileId}-${Date.now()}`;

      const timestamp = new Date().toISOString();

      const pendingMessage = normalizeMessage(
        {
          id: clientRequestId,
          chatId: data.chatId,
          senderId: currentProfileId,
          content: trimmedContent,
          createdAt: timestamp,
          updatedAt: timestamp,
          clientRequestId,
          sender: {
            id: currentProfileId,
            name: currentProfileName,
            photoUrl: currentProfilePhoto,
          },
        },
        "pending",
      );

      pendingMessagesRef.current.set(clientRequestId, data.chatId);
      upsertMessagesForChat(data.chatId, [pendingMessage]);
      indexedDBService.saveMessage(pendingMessage).catch(() => undefined);

      socket.emit(
        "sendMessage",
        {
          chatId: data.chatId,
          recipientId: data.recipientId,
          content: trimmedContent,
          clientRequestId,
          createdAt: timestamp,
        },
        (response: { error?: string }) => {
          if (response?.error) {
            toast.error(response.error);
            void removePendingMessage(clientRequestId, data.chatId);
          }
        },
      );
    },
    [
      socket,
      isConnected,
      currentProfileId,
      currentProfileName,
      currentProfilePhoto,
      normalizeMessage,
      upsertMessagesForChat,
      removePendingMessage,
    ],
  );

  return (
    <SocketContext.Provider value={{ socket, isConnected, isSyncing, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
}