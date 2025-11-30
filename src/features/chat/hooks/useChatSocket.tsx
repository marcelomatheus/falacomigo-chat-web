"use client";

import { useEffect, useMemo } from "react";
import queryClient from "@/lib/tanstack-react-query/query-client";
import { useSocket } from "@/providers/socket-provider";
import { MessageWithSender } from "../interface/message.interface";
import { CHAT_QUERY_KEYS } from "../constants";

export const useChatSocket = (chatId: string) => {
  const { socket } = useSocket();

  const queryKey = useMemo(() => CHAT_QUERY_KEYS.messagesByChatId(chatId, {}), [chatId]);

  useEffect(() => {
    if (!socket) return;

    const handleMissedMessages = (newMessages: MessageWithSender[]) => {
      if (!Array.isArray(newMessages) || newMessages.length === 0) return;

      queryClient.setQueryData<{ data: MessageWithSender[]; total: number } | undefined>(
        queryKey,
        (oldData) => {
          const oldList = oldData?.data ?? [];
          const map = new Map<string, MessageWithSender>(oldList.map((m) => [m.id, m]));
          newMessages.forEach((m) => map.set(m.id, m));
          const merged = Array.from(map.values()).sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
          return { data: merged, total: merged.length };
        },
      );
    };

    const handleNewMessage = (message: MessageWithSender) => {
      handleMissedMessages([message]);
    };

    socket.on("missedMessages", handleMissedMessages);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("missedMessages", handleMissedMessages);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, queryKey]);
};