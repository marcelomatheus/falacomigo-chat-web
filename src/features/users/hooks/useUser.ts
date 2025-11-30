import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user.api";
import { FilterUserParams, User } from "../interface/user.interface";
import { USER_QUERY_KEYS } from "../constants/query-keys";

export const useUsers = (params?: FilterUserParams) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.users(params),
    queryFn: () => userApi.getUsers(params),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.user(id),
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.currentUser(),
    queryFn: () => userApi.getCurrentUser(),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userApi.updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.user(data.id) });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.currentUser() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users() });
    },
  });
};
