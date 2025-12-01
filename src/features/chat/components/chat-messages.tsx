"use client";

import { useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ChatMessagesProps } from "../interface/component-props.interface";

export function ChatMessages({
  messages,
  currentProfileId,
  isLoading = false,
  onRequestTranslation,
  onRequestCorrection,
  className,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    console.log('message: ', messages)
  }, [messages]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            Nenhuma mensagem ainda
          </p>
          <p className="text-sm text-muted-foreground">
            Envie uma mensagem para iniciar a conversa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth",
        className
      )}
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          id={message.id}
          content={message.content}
          senderId={message.senderId}
          currentProfileId={currentProfileId}
          senderName={message.sender?.name}
          senderPhoto={message.sender?.photoUrl}
          timestamp={new Date(message.createdAt)}
          translation={message.translation}
          correctionSuggestions={message.correctionSuggestions}
          status={message.status}
          onRequestTranslation={
            onRequestTranslation
              ? () => onRequestTranslation(message.id, "pt")
              : undefined
          }
          onRequestCorrection={
            onRequestCorrection
              ? () => onRequestCorrection(message.id)
              : undefined
          }
          chatId={message.chatId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
