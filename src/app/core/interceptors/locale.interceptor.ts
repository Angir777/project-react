import type { InternalAxiosRequestConfig } from 'axios';
import i18next from 'i18next';

/**
 * Interceptor adding the selected application language to API requests.
 */
export const localeInterceptor = (request: InternalAxiosRequestConfig) => {
  const locale = i18next.language || 'pl';

  request.headers.set('Locale', locale);

  return request;
};
