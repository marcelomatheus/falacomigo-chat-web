import { useSession } from 'next-auth/react';

export const useAuthStatus = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const user = session?.user;
  const token = session?.accessToken || null;

  return {
    user,
    token,
    status,
    isAuthenticated,
  };
};
