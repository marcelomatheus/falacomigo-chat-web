import { useMutation } from '@tanstack/react-query';

import { accountSecurityApi } from '@/features/my-account/api/account-security.api';

export const useRequestAccountConfirmation = () => {
  return useMutation({
    mutationFn: (email: string) =>
      accountSecurityApi.requestAccountConfirmation({ email }),
  });
};

export const useResendAccountConfirmation = () => {
  return useMutation({
    mutationFn: (email: string) =>
      accountSecurityApi.resendAccountConfirmation({ email }),
  });
};

export const useVerifyAccountConfirmation = () => {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      accountSecurityApi.verifyAccountConfirmation({ email, code }),
  });
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (email: string) => accountSecurityApi.requestPasswordReset({ email }),
  });
};

export const useConfirmPasswordReset = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      accountSecurityApi.confirmPasswordReset({ token, newPassword }),
  });
};
