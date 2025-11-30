"use client";

import { ProfileWithUser } from "../interface/profile.interface";
import { UserListItem } from "./user-list-item";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsersListProps {
  users: ProfileWithUser[];
  isLoading?: boolean;
  onViewProfile: (userId: string) => void;
  onStartChat: (profile: ProfileWithUser) => void;
  className?: string;
}

export function UsersList({
  users,
  isLoading = false,
  onViewProfile,
  onStartChat,
  className,
}: UsersListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">Nenhum usuário encontrado</p>
        <p className="text-sm text-muted-foreground mt-2">
          Tente ajustar os filtros de busca
        </p>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-2", className)}>
      {users.map((user) => (
        <UserListItem
          key={user.id}
          profile={user}
          onViewProfile={() => onViewProfile(user.id)}
          onStartChat={() => onStartChat(user)}
        />
      ))}
    </div>
  );
}