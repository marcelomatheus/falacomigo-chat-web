import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true, 
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
      if (query?.meta?.errorMessage) {
        toast.error(query.meta.errorMessage as string)
      } else {
        toast.error(`Erro: ${(error as Error).message}`)
      }
      
    },
    }), mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(`Erro na operação: ${(error as Error).message}`)
    },
  }),
  })

  export default queryClient;