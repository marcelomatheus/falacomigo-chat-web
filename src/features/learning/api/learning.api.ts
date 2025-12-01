import { api } from "@/lib/axios";
import { FilterLearningParams, PaginatedLearning } from "../interface/learning.interface";

export const learningApi = {
  getDeepCorrections: async (params: FilterLearningParams): Promise<PaginatedLearning> => {
    const response = await api.get("/deep-corrections", { params });
    return response.data;
  },

  deleteDeepCorrection: async (id: string): Promise<void> => {
    await api.delete(`/deep-corrections/${id}`);
  },
};