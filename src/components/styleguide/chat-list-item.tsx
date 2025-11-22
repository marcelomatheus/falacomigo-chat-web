"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatListItemProps {
  name: string
  lastMessage: string
  avatarUrl?: string
  avatarFallback: string
  isSelected?: boolean
  onClick?: () => void
}

export function ChatListItem({
  name,
  lastMessage,
  avatarUrl,
  avatarFallback,
  isSelected = false,
  onClick,
}: ChatListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex gap-3 p-3 rounded-lg transition-colors duration-200",
        "hover:bg-primary/20",
        isSelected ? "bg-accent text-accent-foreground" : "text-foreground",
      )}
    >
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="bg-primary text-primary-foreground">{avatarFallback}</AvatarFallback>
      </Avatar>

      <div className="flex-1 text-left min-w-0">
        <p className="font-semibold text-sm truncate">{name}</p>
        <p className={cn("text-xs truncate", isSelected ? "opacity-80" : "text-muted-foreground")}>{lastMessage}</p>
      </div>
    </button>
  )
}
