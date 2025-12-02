"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Smile, Mic, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocket } from "@/providers/socket-provider";
import { ChatInputBoxProps } from "../interface/component-props.interface";

export function ChatInputBox({
  chatId,
  recipientId,
  onVoiceRecord,
  onAttachment,
  onEmoji,
  placeholder = "Digite uma mensagem...",
  className,
}: ChatInputBoxProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isSyncing, isConnected } = useSocket();
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const isDisabled = !isConnected || isSyncing || !recipientId || !chatId;

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isDisabled) {
      if (!chatId) return;
      sendMessage({
        chatId,
        recipientId,
        content: trimmedMessage,
      });
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        "flex items-end gap-2 p-4 bg-card border-t border-border",
        className
      )}
    >
      {onEmoji && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onEmoji}
          className="flex-shrink-0 mb-1"
          type="button"
        >
          <Smile className="h-5 w-5 text-muted-foreground" />
        </Button>
      )}

      <div className="flex-1 relative flex items-end gap-2 bg-background rounded-2xl border border-input px-4 py-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={isDisabled}
          className="flex-1 min-h-[40px] max-h-[120px] resize-none border-0 bg-transparent dark:bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
          rows={1}
        />
        {onAttachment && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onAttachment}
            className="flex-shrink-0 h-8 w-8"
            type="button"
          >
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      {message.trim() ? (
        <Button
          onClick={handleSend}
          disabled={isDisabled}
          size="icon"
          className="flex-shrink-0 h-10 w-10 rounded-full mb-1"
          type="button"
        >
          <Send className="h-5 w-5" />
        </Button>
      ) : (
        onVoiceRecord && (
          <Button
            onClick={onVoiceRecord}
            variant="ghost"
            size="icon"
            className="flex-shrink-0 mb-1"
            type="button"
          >
            <Mic className="h-5 w-5 text-muted-foreground" />
          </Button>
        )
      )}
    </div>
  );
}
