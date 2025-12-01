"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import UsersFeature from "@/features/users";
import ChatFeature from "@/features/chat";
import ChatList from "@/features/chat/components/chat-list";
import MyAccountFeature from "@/features/my-account";
import LearningFeature from "@/features/learning"; // Importe a nova feature
import { MobileNavigation } from "@/components/mobile-navigation";
import { useFindOrCreateChat } from "@/features/chat/hooks/useFindOrCreateChat";
import { toast } from "react-toastify";
import { CHAT_QUERY_KEYS } from "@/features/chat/constants";
import { ProfileWithUser } from "@/features/users/interface/profile.interface";

export default function ChatPage() {
  const [mobileView, setMobileView] = useState<"users" | "chat" | "profile" | "learning">("users");
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
  const [selectedProfileId, setSelectedProfileId] = useState<string | undefined>();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [startingProfile, setStartingProfile] = useState<ProfileWithUser | null>(null);
  const { mutateAsync: findOrCreateChat } = useFindOrCreateChat();
  const queryClient = useQueryClient();

  const handleStartChat = async (profile: ProfileWithUser) => {
    setStartingProfile(profile);
    setIsStartingChat(true);
    try {
      const { chatId } = await findOrCreateChat(profile.id);
      setSelectedChatId(chatId);
      setSelectedProfileId(profile.id);
      await queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.chats() });
      setMobileView("chat");
    } catch {
      toast.error("Não foi possível iniciar o chat. Tente novamente.");
    } finally {
      setIsStartingChat(false);
      setStartingProfile(null);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setSelectedProfileId(undefined);
    setMobileView("chat");
  };

  const handleOpenLearning = () => {
    setMobileView("learning");
  };

  const handleBackToHome = () => {
    setMobileView("users");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-80 border-r border-border">
          <ChatList
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
            className="h-full"
            onOpenLearning={handleOpenLearning}
          />
        </div>
        <div className="flex-1">
          {mobileView === "learning" ? (
             <LearningFeature 
                onBack={() => {
                  if (selectedChatId) {
                    setMobileView("chat");
                  } else {
                    setMobileView("users"); 
                  }
                }} 
                className="h-full" 
             />
          ) : (
             <ChatFeature chatId={selectedChatId} recipientId={selectedProfileId} className="h-full" />
          )}
        </div>
        <div className="w-80 border-r border-border">
          <UsersFeature onStartChat={handleStartChat} />
        </div>
      </div>

      <div className="md:hidden flex-1 overflow-hidden pb-16">
        {mobileView === "users" && (
          <UsersFeature onStartChat={handleStartChat} />
        )}
        
        {mobileView === "chat" && (
          selectedChatId ? (
            <ChatFeature
              chatId={selectedChatId}
              recipientId={selectedProfileId}
              className="h-full"
              onBack={() => {
                setSelectedChatId(undefined);
                setSelectedProfileId(undefined);
              }}
            />
          ) : (
            <ChatList
              variant="mobile"
              hideHeader
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
              className="h-full"
            />
          )
        )}

        {mobileView === "profile" && (
          <MyAccountFeature />
        )}

        {mobileView === "learning" && (
           <LearningFeature onBack={handleBackToHome} />
        )}
      </div>

      <MobileNavigation
        currentView={mobileView}
        onViewChange={setMobileView}
      />

      {isStartingChat && startingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-5 text-center shadow-lg">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Iniciando uma conversa com {""}
              <span className="font-semibold text-foreground">{startingProfile.name}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}