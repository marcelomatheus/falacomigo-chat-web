"use client";

import { cn } from "@/lib/utils";
import { useChats } from "../hooks/useChat";
import { signOut, useSession } from "next-auth/react";
import { ChatWithParticipants } from "../interface/chat.interface";
import { ChatListItem } from "@/components/styleguide/chat-list-item";
import { Loader2, LogOut } from "lucide-react";
import Image from "next/image";
import { ExtendedChatListProps } from "../interface/component-props.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils/string.utils";

import logo from "../../../../public/logo.png"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ChatList = ({
    selectedChatId,
    onSelectChat,
    className,
    variant = "desktop",
    hideHeader = false,
    onOpenProfile, 
}: ExtendedChatListProps) => {
    const { data: chats, isLoading } = useChats();
    const { data: session } = useSession();
    const currentProfileId = session?.user?.profile?.id;
    const router = useRouter();
    const profile = session?.user?.profile;
    const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };
    const isMobileVariant = variant === "mobile";

    const userChats = (chats as ChatWithParticipants[] | undefined)?.filter((chat) =>
        currentProfileId ? chat.participantIds.includes(currentProfileId) : true,
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            );
        }

        if (!userChats?.length) {
            return (
                <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma conversa encontrada. Inicie um chat na lista de perfis.
                </p>
            );
        }

        return userChats.map((chat) => {
            const otherParticipant = chat.participants?.find(
                (participant) => participant.id !== currentProfileId,
            );
            const title = otherParticipant?.name || chat.name || "Conversa";
            const lastMessage = chat.lastMessage?.content || "Sem mensagens";
            const avatarFallback = otherParticipant?.name
                ? otherParticipant.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "C";

            return (
                <ChatListItem
                    key={chat.id}
                    name={title}
                    lastMessage={lastMessage}
                    avatarUrl={otherParticipant?.photoUrl ?? undefined}
                    avatarFallback={avatarFallback}
                    isSelected={chat.id === selectedChatId}
                    onClick={() => onSelectChat(chat.id)}
                    variant={isMobileVariant ? "compact" : "default"}
                />
            );
        });
    };

    return (
        <div
            className={cn(
                "flex flex-col bg-background",
                isMobileVariant ? "rounded-t-2xl bg-card/95" : "h-full",
                className,
            )}
        >
            <div
                className={cn(
                    "overflow-y-auto",
                    isMobileVariant ? "flex-1 px-3 py-2 space-y-1" : "flex-1 p-4 space-y-2",
                )}
            >
                {!hideHeader && (
                    <div className="flex flex-col items-center justify-center mb-4">
                        <Image
                            src={logo}
                            alt="Fala Comigo Logo"
                            width={80}
                            height={80}
                            className="object-contain"
                            priority
                        />

                        <h1 className="text-lg color-primary font-bold text-foreground tracking-tight">
                            Fala Comigo
                        </h1>

                        <div className="w-full border-b border-border/80 mt-3" />
                    </div>
                )}
                
                {renderContent()}
            </div>

            {!isMobileVariant && onOpenProfile && profile && (
                <div className="flex items-center justify-between p-3 border-t border-border bg-card">
                <button
                    onClick={onOpenProfile}
                    className="flex items-center gap-3 p-2 rounded hover:bg-secondary  transition-colors"
                >
                    <Avatar className="h-10 w-10">
                        {profile.photoUrl ? (
                            <AvatarImage src={profile.photoUrl} alt={profile.name} />
                        ) : null}
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {profile.name ? getInitials(profile.name) : "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="font-semibold text-sm text-foreground truncate">
                            {profile.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {session?.user?.email || ""}
                        </p>
                    </div>
                    
                </button>
                 <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
      </Button>
      </div>
            )}
           
        </div>
    );
};

export default ChatList;