"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Users, MessageCircle, User as UserIcon } from "lucide-react";

interface MobileNavigationProps {
  currentView: "users" | "chat" | "profile";
  onViewChange: (view: "users" | "chat" | "profile") => void;
  className?: string;
  chatListSlot?: ReactNode;
}

export function MobileNavigation({
  currentView,
  onViewChange,
  className,
  chatListSlot,
}: MobileNavigationProps) {
  const navItems = [
    {
      id: "users" as const,
      icon: Users,
      label: "Usuários",
    },
    {
      id: "chat" as const,
      icon: MessageCircle,
      label: "Conversas",
    },
    {
      id: "profile" as const,
      icon: UserIcon,
      label: "Perfil",
    },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden",
        className
      )}
    >
      {chatListSlot && currentView === "chat" && (
        <div className="border-b border-border max-h-72 overflow-y-auto">
          {chatListSlot}
        </div>
      )}
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 flex-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "animate-bounce")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
