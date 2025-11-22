"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface ChatInputAreaProps {
  onSendMessage?: (message: string) => void
  disabled?: boolean
}

export function ChatInputArea({ onSendMessage, disabled = false }: ChatInputAreaProps) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSend()
    }
  }

  return (
    <div className="flex gap-2 p-4 bg-card border-t border-border rounded-lg">
      <Textarea
        placeholder="Digite sua mensagem..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="h-12 resize-none border-input bg-background/50 focus-visible:ring-primary"
        rows={1}
      />
      <Button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        size="lg"
        className="px-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  )
}
