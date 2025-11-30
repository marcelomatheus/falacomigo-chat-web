export type { ActionResponse } from './responses';
export type { RegisterUser } from './auth';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  createdAt: string;
  sender?: User;
}

export interface Chat {
  id: string;
  name?: string;
  participants: User[];
  lastMessage?: Message;
  updatedAt: string;
  unreadCount?: number;
}

export interface SendMessagePayload {
  chatId: string;
  content: string;
}

export interface JoinRoomPayload {
  chatId: string;
}

export interface ServerToClientEvents {
  newMessage: (message: Message) => void;
  missedMessages: (messages: Message[]) => void;
}

export interface ClientToServerEvents {
  sendMessage: (payload: SendMessagePayload) => void;
}
