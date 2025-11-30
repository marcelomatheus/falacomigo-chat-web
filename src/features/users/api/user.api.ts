import { api } from "@/lib/axios";
import { User, FilterUserParams } from "../interface/user.interface";

export const userApi = {
  getUsers: async (params?: FilterUserParams): Promise<User[]> => {
    const response = await api.get("/user", { params });
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/user/me");
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.patch(`/user/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/user/${id}`);
  },
};
