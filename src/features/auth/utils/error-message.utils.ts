import { BACKEND_ERROR_TRANSLATIONS } from '@/features/auth/constants/backend-error-translations';

type ErrorWithResponse = {
  response?: {
    data?: {
      message?: string | string[];
      error?: string;
    };
  };
};

const normalize = (message: string) =>
  message
    .toLowerCase()
    .trim()
    .replace(/^error:\s*/i, '')
    .replace(/[.!]$/, '');

export const translateBackendMessage = (
  rawMessage: string | undefined,
  fallbackMessage: string,
): string => {
  if (!rawMessage) {
    return fallbackMessage;
  }

  const normalizedMessage = normalize(rawMessage);
  return BACKEND_ERROR_TRANSLATIONS[normalizedMessage] ?? rawMessage;
};

export const extractBackendErrorMessage = (
  error: unknown,
): string | undefined => {
  const maybeError = error as ErrorWithResponse;
  const responseMessage = maybeError?.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(', ');
  }

  if (typeof responseMessage === 'string') {
    return responseMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return undefined;
};
