import { api } from "@/lib/axios";
import {
  Profile,
  FilterProfileParams,
  PaginatedProfiles,
  ProfileWithUser,
} from "../interface/profile.interface";

export const profileApi = {
  getProfiles: async (
    params?: FilterProfileParams
  ): Promise<PaginatedProfiles> => {
    const response = await api.get("/profile", { params });
    return response.data;
  },

  getProfileById: async (id: string): Promise<ProfileWithUser> => {
    const response = await api.get(`/profile/${id}`);
    return response.data;
  },

  getProfileByUserId: async (userId: string): Promise<Profile> => {
    const response = await api.get(`/profile/user/${userId}`);
    return response.data;
  },

  getMyProfile: async (): Promise<Profile> => {
    const response = await api.get("/profile/me");
    return response.data;
  },

  createProfile: async (data: {
    name: string;
    photoUrl?: string | null;
    userId: string;
    learningLang?: string;
    learningLevel?: string;
    knownLanguages?: string[];
  }): Promise<Profile> => {
    const response = await api.post("/profile", data);
    return response.data;
  },

  updateProfile: async (
    id: string,
    data: Partial<Profile>
  ): Promise<Profile> => {
    const response = await api.patch(`/profile/${id}`, data);
    return response.data;
  },

  deleteProfile: async (id: string): Promise<void> => {
    await api.delete(`/profile/${id}`);
  },
};
