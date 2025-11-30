import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messageApi } from "../api/message.api";
import {
  SendMessageParams,
  FilterMessageParams,
  MessageWithSender
} from "../interface/message.interface";
import { CHAT_QUERY_KEYS } from "../constants";
import { toast } from "react-toastify"; // Adicione o import do toast

export const useMessages = (params?: FilterMessageParams) => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.messages(params),
    queryFn: () => messageApi.getMessages(params),
  });
};

export const useMessage = (id: string) => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.message(id),
    queryFn: () => messageApi.getMessageById(id),
    enabled: !!id,
  });
};

export const useMessagesByChatId = (chatId: string) => {
  const queryClient = useQueryClient();
  const key = CHAT_QUERY_KEYS.messagesByChatId(chatId, {});
  const isLoading = queryClient.isFetching({ queryKey: key }) > 0;
  const data = queryClient.getQueryData<{
    data: MessageWithSender[];
    total: number;
  }>(key);

  return { data, isLoading };
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageParams) => messageApi.sendMessage(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages() });
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.messagesByChat(data.chatId),
      });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.chats() });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.chat(data.chatId) });
    },
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ content: string }> }) =>
      messageApi.updateMessage(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages() });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.message(data.id) });
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.messagesByChat(data.chatId),
      });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => messageApi.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages() });
    },
  });
};

export const useRequestTranslation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, targetLang }: { messageId: string; targetLang: string }) =>
      messageApi.requestTranslation(messageId, targetLang),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.message(data.id) });
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.messagesByChat(data.chatId),
      });
    },
  });
};

export const useRequestCorrection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => messageApi.requestCorrection(messageId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.message(data.id) });
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.messagesByChat(data.chatId),
      });
    },
  });
};

export const useInterpretMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { content: string; senderId: string; messageId: string }) =>
      messageApi.interpret(data),
    onSuccess: (data) => {
      if (data.deepCorrections && Array.isArray(data.deepCorrections) && data.deepCorrections.length > 0) {
        toast.success("Novo aprendizado foi gerado!");
      }
    },
  });
};