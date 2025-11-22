"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CheckCheck } from "lucide-react"

interface MessageBubbleProps {
  content: string
  variant: "self" | "other"
  timestamp?: string
  showAISuggest?: boolean
}

export function MessageBubble({ content, variant, timestamp, showAISuggest = false }: MessageBubbleProps) {
  const isSelf = variant === "self"

  return (
    <div className={cn("flex gap-2", isSelf ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
          isSelf
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary text-secondary-foreground rounded-bl-none",
        )}
      >
        <p className="text-sm break-words">{content}</p>
        {timestamp && <p className="text-xs mt-1 opacity-70">{timestamp}</p>}
        {isSelf && (
          <div className="flex items-center gap-1 mt-1">
            <CheckCheck className="w-3 h-3" />
            <span className="text-xs opacity-70">Entregue</span>
          </div>
        )}
      </div>

      {isSelf && showAISuggest && (
        <div className="flex flex-col justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-xs text-accent hover:text-accent hover:bg-accent/10"
          >
            Sugerir correção
          </Button>
        </div>
      )}
    </div>
  )
}
