"use client";

import { cn } from "@/lib/utils";
import { useChats } from "../hooks/useChat";
import { useSession } from "next-auth/react";
import { ChatWithParticipants } from "../interface/chat.interface";
import { ChatListItem } from "@/components/styleguide/chat-list-item";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { ChatListProps } from "../interface/component-props.interface";

import logo from "../../../../public/logo.png"

const ChatList = ({
    selectedChatId,
    onSelectChat,
    className,
    variant = "desktop",
    hideHeader = false,
}: ChatListProps) => {
    const { data: chats, isLoading } = useChats();
    const { data: session } = useSession();
    const currentProfileId = session?.user?.profile?.id;
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
            {!hideHeader && (
                <div
                    className={cn(
                        "border-b border-border",
                        isMobileVariant ? "px-4 py-4" : "p-4",
                    )}
                >
                    <h2 className="text-lg font-semibold">Suas Conversas</h2>
                    <p className="text-xs text-muted-foreground">
                        Escolha para continuar o bate-papo
                    </p>
                </div>
            )}
            <div
                className={cn(
                    "overflow-y-auto",
                    isMobileVariant ? "flex-1 px-3 py-2 space-y-1" : "flex-1 p-4 space-y-2",
                )}
            >
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
                {renderContent()}

            </div>
        </div>
    );
};

export default ChatList;