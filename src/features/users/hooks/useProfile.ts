import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import { FilterProfileParams, Profile } from "../interface/profile.interface";
import { USER_QUERY_KEYS } from "../constants/query-keys";

export const useProfiles = (params?: FilterProfileParams) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.profiles(params),
    queryFn: () => profileApi.getProfiles(params),
  });
};

export const useProfile = (id: string) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.profile(id),
    queryFn: () => profileApi.getProfileById(id),
    enabled: !!id,
  });
};

export const useProfileByUserId = (userId: string) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.profileByUser(userId),
    queryFn: () => profileApi.getProfileByUserId(userId),
    enabled: !!userId,
  });
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.myProfile(),
    queryFn: () => profileApi.getMyProfile(),
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      photoUrl?: string | null;
      userId: string;
      learningLang?: string;
      learningLevel?: string;
      knownLanguages?: string[];
    }) => profileApi.createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.profiles() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.myProfile() });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Profile> }) =>
      profileApi.updateProfile(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.profiles() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.profile(data.id) });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.myProfile() });
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => profileApi.deleteProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.profiles() });
    },
  });
};
