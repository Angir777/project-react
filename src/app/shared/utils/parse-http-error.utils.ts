import { isAxiosError } from 'axios';

export interface ApiError {
  message: string;
  errors: Record<string, string[]>;
}

/**
 * Processing the response from the API.
 * @param error
 * @returns
 */
export function parseHttpError(error: unknown): ApiError {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  const backendError = (isAxiosError(error) ? error.response?.data : undefined) ?? {};

  // Laravel validation
  if (status === 422 && backendError.errors) {
    return {
      message: 'VALIDATION_ERROR',
      errors: backendError.errors,
    };
  }

  // ApiException
  if (backendError.message) {
    return {
      message: backendError.message,
      errors: backendError.errors ?? {},
    };
  }

  // Fallback
  return {
    message: 'GENERAL_ERROR',
    errors: {},
  };
}
