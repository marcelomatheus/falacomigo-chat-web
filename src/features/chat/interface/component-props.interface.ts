import { MessageWithSender, Translation, CorrectionSuggestion } from "./message.interface";

export interface ChatFeatureProps {
  chatId?: string;
  recipientId?: string;
  className?: string;
  onBack?: () => void;
}

export interface ChatFeatureMockProps {
  chatId?: string;
  className?: string;
}

export interface ChatContainerProps {
  chatId?: string;
  recipientId: string;
  participantName: string;
  participantPhoto?: string | null;
  participantStatus?: string;
  messages: MessageWithSender[];
  currentProfileId: string;
  isLoading?: boolean;
  onBack?: () => void;
  onRequestTranslation?: (messageId: string, targetLang: string) => void;
  onRequestCorrection?: (messageId: string) => void;
  className?: string;
}

export interface ChatMessagesProps {
  messages: MessageWithSender[];
  currentProfileId: string;
  isLoading?: boolean;
  onRequestTranslation?: (messageId: string, targetLang: string) => void;
  onRequestCorrection?: (messageId: string) => void;
  className?: string;
}

export interface ChatInputBoxProps {
  chatId?: string;
  recipientId: string;
  onVoiceRecord?: () => void;
  onAttachment?: () => void;
  onEmoji?: () => void;
  placeholder?: string;
  className?: string;
}

export interface ChatListProps {
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
  className?: string;
  variant?: "desktop" | "mobile";
  hideHeader?: boolean;
}

export interface ExtendedChatListProps extends ChatListProps {
  onOpenProfile?: () => void;
}

export interface ChatHeaderProps {
  participantName: string;
  participantPhoto?: string | null;
  participantStatus?: string;
  onBack?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onMoreOptions?: () => void;
  className?: string;
}

export interface ChatMessageBubbleProps {
  content: string;
  senderId: string;
  currentProfileId: string;
  senderName?: string;
  senderPhoto?: string | null;
  timestamp: Date;
  translation?: Translation | null;
  correctionSuggestions?: CorrectionSuggestion | null;
  status?: "pending" | "sent";
  onRequestTranslation?: () => void;
  onRequestCorrection?: () => void;
  className?: string;
}
