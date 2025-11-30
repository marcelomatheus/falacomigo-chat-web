"use client";

import { useState, useEffect } from "react";
import { ChatContainer } from "./components/chat-container";
import { useChats } from "./hooks/useChat";
import { useMessagesByChatId } from "./hooks/useMessage";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ChatFeatureProps } from "./interface/component-props.interface";

export default function ChatFeature({ chatId, recipientId: propRecipientId, className }: ChatFeatureProps) {
  const { data: session } = useSession();
  const [activeChatId, setActiveChatId] = useState(chatId);
  const { data: chats, isLoading: isLoadingChats } = useChats();

  const { data: messagesData, isLoading: isLoadingMessages } =
    useMessagesByChatId(activeChatId || "");
  console.log('fetchhh: ', messagesData)
  const activeChat = Array.isArray(chats) ? chats.find((c) => c.id === activeChatId) : undefined;

  const currentProfileId = session?.user?.profile?.id;

  const otherParticipant = activeChat?.participants?.find(
    (p) => p.id !== currentProfileId,
  );

  const recipientId = propRecipientId || otherParticipant?.id || "";

  useEffect(() => {
    if (chatId) {
      setActiveChatId(chatId);
    }
  }, [chatId]);

  if (!activeChatId) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div className="space-y-2">
          <p className="text-muted-foreground">Selecione uma conversa</p>
          <p className="text-sm text-muted-foreground">
            ou inicie uma nova conversa com um usuário
          </p>
        </div>
      </div>
    );
  }

  if (isLoadingChats || isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!activeChat) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <p className="text-muted-foreground">Conversa não encontrada</p>
      </div>
    );
  }

  return (
    <div className={cn("h-full", className)}>
      <ChatContainer
        chatId={activeChatId}
        recipientId={recipientId}
        participantName={otherParticipant?.name || "Usuário"}
        participantPhoto={otherParticipant?.photoUrl}
        participantStatus=""
        messages={messagesData?.data || []}
        currentProfileId={currentProfileId || ""}
        isLoading={isLoadingMessages}
      />
    </div>
  );
}
