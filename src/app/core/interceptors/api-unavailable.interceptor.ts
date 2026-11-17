import { isAxiosError } from 'axios';

/**
 * Interceptor handling a missing API connection.
 */
export const apiUnavailableInterceptor = (error: unknown) => {
  if (isAxiosError(error) && (error.response?.status ?? 0) <= 0) {
    // Notify that there is no API connection.
    console.error('NO_CONNECTION_TO_API');
  }
  return Promise.reject(error);
};
