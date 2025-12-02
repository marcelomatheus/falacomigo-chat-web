import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { learningApi } from "../api/learning.api";
import { FilterLearningParams } from "../interface/learning.interface";

export const LEARNING_KEYS = {
  all: ["learning"] as const,
  list: (params: FilterLearningParams) => ["learning", "list", params] as const,
};

export const useLearnings = (params: FilterLearningParams) => {
  return useQuery({
    queryKey: LEARNING_KEYS.list(params),
    queryFn: () => learningApi.getDeepCorrections(params),

    placeholderData: (previousData) => previousData, 
  });
};

export const useDeleteLearning = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => learningApi.deleteDeepCorrection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEARNING_KEYS.all });
    },
  });
};