import { api } from '@/lib/axios';

type EmailPayload = {
  email: string;
};

type ConfirmCodePayload = {
  email: string;
  code: string;
};

type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

type MessageResponse = {
  message: string;
};

export const accountSecurityApi = {
  async requestAccountConfirmation(payload: EmailPayload): Promise<MessageResponse> {
    const response = await api.post('/auth/confirm-account/request', payload);
    return response.data;
  },

  async resendAccountConfirmation(payload: EmailPayload): Promise<MessageResponse> {
    const response = await api.post('/auth/confirm-account/resend', payload);
    return response.data;
  },

  async verifyAccountConfirmation(payload: ConfirmCodePayload): Promise<MessageResponse> {
    const response = await api.post('/auth/confirm-account/verify', payload);
    return response.data;
  },

  async requestPasswordReset(payload: EmailPayload): Promise<MessageResponse> {
    const response = await api.post('/auth/password-reset/request', payload);
    return response.data;
  },

  async confirmPasswordReset(payload: ResetPasswordPayload): Promise<MessageResponse> {
    const response = await api.post('/auth/password-reset/confirm', payload);
    return response.data;
  },
};
