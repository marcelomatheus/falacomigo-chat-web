export interface Chat {
  id: string;
  name?: string | null;
  isGroup: boolean;
  participantIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatWithParticipants extends Chat {
  participants?: Array<{
    id: string;
    name: string;
    photoUrl?: string | null;
  }>;
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
  };
}

export interface CreateChatParams {
  name?: string;
  participantIds: string[];
  isGroup?: boolean;
}

export interface FilterChatParams {
  participantId?: string;
  isGroup?: boolean;
  page?: number;
  limit?: number;
}
