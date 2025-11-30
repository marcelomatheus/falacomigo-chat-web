"use client";

import ChatHeader from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInputBox } from "./chat-input-box";
import { cn } from "@/lib/utils";
import { ChatContainerProps } from "../interface/component-props.interface";

export function ChatContainer({
  chatId,
  recipientId,
  participantName,
  participantPhoto,
  participantStatus,
  messages,
  currentProfileId,
  isLoading = false,
  onBack,
  onRequestTranslation,
  onRequestCorrection,
  className,
}: ChatContainerProps) {
  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <ChatHeader
        participantName={participantName}
        participantPhoto={participantPhoto}
        participantStatus={participantStatus}
        onBack={onBack}
      />

      <ChatMessages
        messages={messages}
        currentProfileId={currentProfileId}
        isLoading={isLoading}
        onRequestTranslation={onRequestTranslation}
        onRequestCorrection={onRequestCorrection}
      />

      <ChatInputBox
        chatId={chatId}
        recipientId={recipientId}
        placeholder="Digite sua mensagem..."
      />
    </div>
  );
}