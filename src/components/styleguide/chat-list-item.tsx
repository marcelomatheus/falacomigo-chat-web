"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatListItemProps {
  name: string;
  lastMessage: string;
  avatarUrl?: string;
  avatarFallback: string;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: "default" | "compact";
}

export function ChatListItem({
  name,
  lastMessage,
  avatarUrl,
  avatarFallback,
  isSelected = false,
  onClick,
  variant = "default",
}: ChatListItemProps) {
  const isCompact = variant === "compact";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex gap-3 rounded-lg transition-colors duration-200",
        isCompact ? "p-2" : "p-3",
        "hover:bg-primary/20",
        isSelected ? "bg-primary text-primary-foreground" : "text-foreground",
      )}
    >
      <Avatar className={cn("flex-shrink-0", isCompact ? "h-9 w-9" : "h-10 w-10")}>
        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="bg-secondary text-primary-foreground">
          {avatarFallback}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 text-left min-w-0">
        <p className={cn("font-semibold truncate", isCompact ? "text-sm" : "text-base")}>{name}</p>
        <p
          className={cn(
            "truncate",
            isCompact ? "text-[11px]" : "text-xs",
            isSelected ? "opacity-80" : "text-muted-foreground",
          )}
        >
          {lastMessage}
        </p>
      </div>
    </button>
  );
}
