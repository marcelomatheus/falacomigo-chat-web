import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface FindOrCreateChatResponse {
  chatId: string;
  isNew: boolean;
}

export function useFindOrCreateChat() {
  return useMutation({
    mutationFn: async (recipientId: string): Promise<FindOrCreateChatResponse> => {
      const { data } = await api.post<FindOrCreateChatResponse>(
        '/chat/find-or-create',
        { recipientId }
      );
      return data;
    },
  });
}
