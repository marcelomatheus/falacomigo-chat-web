import { api } from "@/lib/axios";
import {
  Chat,
  ChatWithParticipants,
  CreateChatParams,
  FilterChatParams,
} from "../interface/chat.interface";

export const chatApi = {
  getChats: async (params?: FilterChatParams): Promise<ChatWithParticipants[]> => {
    const response = await api.get("/chat", { params });
    return response.data;
  },

  getChatById: async (id: string): Promise<ChatWithParticipants> => {
    const response = await api.get(`/chat/${id}`);
    return response.data;
  },

  createChat: async (data: CreateChatParams): Promise<Chat> => {
    const response = await api.post("/chat", data);
    return response.data;
  },

  updateChat: async (
    id: string,
    data: Partial<{ name: string }>
  ): Promise<Chat> => {
    const response = await api.patch(`/chat/${id}`, data);
    return response.data;
  },

  deleteChat: async (id: string): Promise<void> => {
    await api.delete(`/chat/${id}`);
  },

  addParticipant: async (
    chatId: string,
    profileId: string
  ): Promise<Chat> => {
    const response = await api.post(`/chat/${chatId}/participants`, { profileId });
    return response.data;
  },

  removeParticipant: async (
    chatId: string,
    profileId: string
  ): Promise<Chat> => {
    const response = await api.delete(`/chat/${chatId}/participants/${profileId}`);
    return response.data;
  },
};
