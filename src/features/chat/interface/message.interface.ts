export interface Translation {
  originalText: string;
  translatedText: string;
  targetLanguage: string;
}

export interface CorrectionSuggestion {
  suggestionText: string;
  reason: string;
}

export interface InterpretResponse {
  translation: Translation;
  correctionSuggestions: CorrectionSuggestion;
  deepCorrections: any[];
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  translation?: Translation | null; 
  correctionSuggestions?: CorrectionSuggestion | null;
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
