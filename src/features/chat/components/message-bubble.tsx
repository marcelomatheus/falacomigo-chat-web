"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatMessageBubbleProps } from "../interface/component-props.interface";

export function MessageBubble({
  content,
  senderId,
  currentProfileId,
  senderName,
  senderPhoto,
  timestamp,
  translation,
  correctionSuggestions,
  status = 'sent',
  onRequestTranslation,
  onRequestCorrection,
  className,
}: ChatMessageBubbleProps) {
  const isOwnMessage = senderId === currentProfileId;
  const timeString = new Date(timestamp).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        "flex gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isOwnMessage ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
          {senderPhoto ? (
            <AvatarImage src={senderPhoto} alt={senderName} />
          ) : null}
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
            {getInitials(senderName)}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col gap-1 max-w-[75%] sm:max-w-[60%]",
          isOwnMessage ? "items-end" : "items-start"
        )}
      >
        {!isOwnMessage && senderName && (
          <span className="text-xs text-muted-foreground px-3">
            {senderName}
          </span>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2 shadow-sm",
            isOwnMessage
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card border border-border rounded-tl-sm"
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>

          {translation && (
            <div className="mt-2 pt-2 border-t border-primary-foreground/20">
              <Badge variant="outline" className="mb-1 text-xs">
                Tradução
              </Badge>
              <p className="text-xs opacity-90">
                {translation.translatedText as string}
              </p>
            </div>
          )}

          {correctionSuggestions && (
            <div className="mt-2 pt-2 border-t border-primary-foreground/20">
              <Badge variant="outline" className="mb-1 text-xs">
                Sugestão de correção
              </Badge>
              <p className="text-xs opacity-90">
                {correctionSuggestions.suggestion as string}
              </p>
            </div>
          )}

          <div
            className={cn(
              "text-[10px] mt-1 flex items-center gap-1",
              isOwnMessage
                ? "justify-end opacity-80"
                : "justify-start text-muted-foreground"
            )}
          >
            <span>{timeString}</span>
            {isOwnMessage && status === 'pending' && (
              <span className="uppercase text-[9px] tracking-wide">
                Enviando...
              </span>
            )}
          </div>
        </div>

        {!isOwnMessage && (
          <div className="flex gap-2 px-2">
            {onRequestTranslation && !translation && (
              <button
                onClick={onRequestTranslation}
                className="text-[10px] text-accent hover:underline"
              >
                Traduzir
              </button>
            )}
            {onRequestCorrection && !correctionSuggestions && (
              <button
                onClick={onRequestCorrection}
                className="text-[10px] text-accent hover:underline"
              >
                Corrigir
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
