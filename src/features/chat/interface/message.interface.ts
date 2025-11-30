export interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  translation?: Record<string, unknown> | null;
  correctionSuggestions?: Record<string, unknown> | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  clientRequestId?: string;
  status?: 'pending' | 'sent';
}

export interface MessageWithSender extends Message {
  sender?: {
    id: string;
    name: string;
    photoUrl?: string | null;
  };
}

export interface SendMessageParams {
  content: string;
  chatId: string;
}

export interface FilterMessageParams {
  chatId?: string;
  senderId?: string;
  page?: number;
  limit?: number;
  orderBy?: 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedMessages {
  data: MessageWithSender[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
