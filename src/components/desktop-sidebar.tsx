"use client";

import { cn } from "@/lib/utils";
import { Users, User as UserIcon, BookOpen} from "lucide-react";
import { Button } from "@/components/ui/button";
interface DesktopSidebarProps {
  currentView: "users" | "profile" | "learning";
  onViewChange: (view: "users" | "profile" | "learning") => void;
  className?: string;
}

export function DesktopSidebar({
  currentView,
  onViewChange,
  className,
}: DesktopSidebarProps) {

  const navItems = [
    {
      id: "users" as const,
      icon: Users,
      label: "Usuários",
      description: "Encontre parceiros",
    },
    {
      id: "learning" as const,
      icon: BookOpen,
      label: "Aprendizados",
      description: "Meus estudos",
    },
    {
      id: "profile" as const,
      icon: UserIcon,
      label: "Minha Conta",
      description: "Configurações",
    },
  ];

  

  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 py-3 bg-card border-b border-border",
        className
      )}
    >
      <nav className="flex items-center flex-1 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <Button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              variant={isActive ? 'default' : 'ghost'}
             
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive && "animate-pulse"
                )}
              />
              <div className="text-left">
                <p>
                  {item.label}
                </p>
              </div>
            </Button>
          );
        })}
      </nav>

      
    </header>
  );
}
