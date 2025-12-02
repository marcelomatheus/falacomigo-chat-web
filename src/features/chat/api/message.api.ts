import { api } from "@/lib/axios";
import {
  Message,
  MessageWithSender,
  SendMessageParams,
  FilterMessageParams,
  PaginatedMessages,
  InterpretResponse, 
} from "../interface/message.interface";

export const messageApi = {
  getMessages: async (
    params?: FilterMessageParams
  ): Promise<PaginatedMessages> => {
    const response = await api.get("/message", { params });
    return response.data;
  },

  getMessageById: async (id: string): Promise<MessageWithSender> => {
    const response = await api.get(`/message/${id}`);
    return response.data;
  },

  getMessagesByChatId: async (
    chatId: string,
    params?: Omit<FilterMessageParams, "chatId">
  ): Promise<PaginatedMessages> => {
    const response = await api.get(`/message/chat/${chatId}`, { params });
    return response.data;
  },

  sendMessage: async (data: SendMessageParams): Promise<Message> => {
    const response = await api.post("/message", data);
    return response.data;
  },

  updateMessage: async (
    id: string,
    data: Partial<{ content: string }>
  ): Promise<Message> => {
    const response = await api.patch(`/message/${id}`, data);
    return response.data;
  },

  deleteMessage: async (id: string): Promise<void> => {
    await api.delete(`/message/${id}`);
  },

  requestTranslation: async (
    messageId: string,
    targetLang: string
  ): Promise<Message> => {
    const response = await api.post(`/message/${messageId}/translate`, {
      targetLang,
    });
    return response.data;
  },

  requestCorrection: async (messageId: string): Promise<Message> => {
    const response = await api.post(`/message/${messageId}/correct`);
    return response.data;
  },

  interpret: async (data: {
    content: string;
    senderId: string;
    messageId: string;
  }): Promise<InterpretResponse> => {
    const response = await api.post("/ai-tools/interpret", data);
    return response.data;
  },
};