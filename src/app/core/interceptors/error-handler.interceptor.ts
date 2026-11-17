import { environment } from '@environments';

/**
 * Interceptor handling request errors.
 */
export const errorHandlerInterceptor = (error: unknown) => {
  if (!environment.PRODUCTION) {
    console.error('[DAILO] Interceptor error.', error);
  }

  return Promise.reject(error);
};
