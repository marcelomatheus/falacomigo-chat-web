"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface ChatHeaderProps {
  name: string
  status?: "online" | "offline" | "typing"
  avatarUrl?: string
  avatarFallback: string
}

export function ChatHeader({ name, status = "online", avatarUrl, avatarFallback }: ChatHeaderProps) {
  const statusText = {
    online: "Online",
    offline: "Offline",
    typing: "Digitando...",
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-card border-b border-border rounded-t-lg">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="bg-primary text-primary-foreground">{avatarFallback}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <p className="font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{statusText[status]}</p>
      </div>
    </div>
  )
}
