"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatHeaderProps } from "../interface/component-props.interface";

export default function ChatHeader({
  participantName,
  participantPhoto,
  participantStatus = "Online",
  onBack,
  onCall,
  onVideoCall,
  onMoreOptions,
  className,
}: ChatHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 p-4 bg-card border-b border-border",
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="md:hidden flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        <Avatar className="h-10 w-10 flex-shrink-0">
          {participantPhoto ? (
            <AvatarImage src={participantPhoto} alt={participantName} />
          ) : null}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(participantName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold truncate">{participantName}</h2>
          <p className="text-xs text-muted-foreground truncate">
            {participantStatus}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {onCall && (
          <Button variant="ghost" size="icon" onClick={onCall}>
            <Phone className="h-5 w-5" />
          </Button>
        )}
        {onVideoCall && (
          <Button variant="ghost" size="icon" onClick={onVideoCall}>
            <Video className="h-5 w-5" />
          </Button>
        )}
        {onMoreOptions && (
          <Button variant="ghost" size="icon" onClick={onMoreOptions}>
            <MoreVertical className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}