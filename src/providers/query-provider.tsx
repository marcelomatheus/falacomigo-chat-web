'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';
import queryClientInstance from '@/lib/tanstack-react-query/query-client';
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => queryClientInstance);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}