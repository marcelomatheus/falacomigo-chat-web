import { useQuery, useMutation } from "@tanstack/react-query";
import { chatApi } from "../api/chat.api";
import { CreateChatParams, FilterChatParams } from "../interface/chat.interface";
import { CHAT_QUERY_KEYS } from "../constants";
import queryClient from "@/lib/tanstack-react-query/query-client";
export const useChats = (params?: FilterChatParams) => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.chats(params),
    queryFn: () => chatApi.getChats(params),
  });
};

export const useChat = (id: string) => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.chat(id),
    queryFn: () => chatApi.getChatById(id),
    enabled: !!id,
  });
};

export const useCreateChat = () => {

  return useMutation({
    mutationFn: (data: CreateChatParams) => chatApi.createChat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.chats() });
    },
  });
};

export const useUpdateChat = () => {

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ name: string }> }) =>
      chatApi.updateChat(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.chats() });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.chat(data.id) });
    },
  });
};

export const useDeleteChat = () => {

  return useMutation({
    mutationFn: (id: string) => chatApi.deleteChat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.chats() });
    },
  });
};

export const useAddParticipant = () => {

  return useMutation({
    mutationFn: ({ chatId, profileId }: { chatId: string; profileId: string }) =>
      chatApi.addParticipant(chatId, profileId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.chats() });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.chat(data.id) });
    },
  });
};

export const useRemoveParticipant = () => {
  

  return useMutation({
    mutationFn: ({ chatId, profileId }: { chatId: string; profileId: string }) =>
      chatApi.removeParticipant(chatId, profileId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.chats() });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.chat(data.id) });
    },
  });
};
