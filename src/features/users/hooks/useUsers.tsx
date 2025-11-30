import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { getUsers, createUser, updateUser } from "../api/api-user";
import queryClient from "@/lib/tanstack-react-query/query-client";
import { toast } from "react-toastify";
interface UseUsersParams {
  page: number;
  filter: string;
}

export const useFindUsers = (params: UseUsersParams) => {
  return useQuery({
    queryKey: ['users', params], 
    
    queryFn: () => getUsers(params),
    
    placeholderData: keepPreviousData, 
    
    meta: {
      errorMessage: "Não foi possível carregar a lista de usuários."
    }
  });
};

export const useCreateUser = () => {

  return useMutation({
    mutationFn: createUser,
    
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["users"] 
      });
      
    },

    onError: (error) => {
      toast.error("Erro ao enviar mensagem");
      console.error(error);
    },
  });
};

export const useUpdateUser = () => {
   return useMutation({
    mutationFn: updateUser,
    
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["users"] 
      });
      
    },

    onError: (error) => {
      toast.error("Erro ao enviar mensagem");
      console.error(error);
    },
  });
}

