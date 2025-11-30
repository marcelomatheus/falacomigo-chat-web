"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileWithUser } from "../interface/profile.interface";
import { MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserListItemProps {
  profile: ProfileWithUser;
  onViewProfile: () => void;
  onStartChat: () => void;
  className?: string;
}

export function UserListItem({
  profile,
  onViewProfile,
  onStartChat,
  className,
}: UserListItemProps) {
  const getInitials = (name: string) => {
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
        "flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <Avatar className="h-12 w-12 flex-shrink-0">
        {profile.photoUrl ? (
          <AvatarImage src={profile.photoUrl} alt={profile.name} />
        ) : null}
        <AvatarFallback className="bg-primary text-primary-foreground">
          {getInitials(profile.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">
          {profile.name}
        </h3>
        <div className="flex flex-wrap gap-1 mt-1">
          {profile.learningLang && (
            <Badge variant="secondary" className="text-xs">
              Aprendendo: {profile.learningLang.toUpperCase()}
            </Badge>
          )}
          {profile.learningLevel && (
            <Badge variant="outline" className="text-xs">
              {profile.learningLevel}
            </Badge>
          )}
        </div>
        {profile.knownLanguages && profile.knownLanguages.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Fala: {profile.knownLanguages.map(lang => lang.toUpperCase()).join(", ")}
          </p>
        )}
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onViewProfile}
          title="Ver perfil"
        >
          <User className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={onStartChat}
          title="Iniciar conversa"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}