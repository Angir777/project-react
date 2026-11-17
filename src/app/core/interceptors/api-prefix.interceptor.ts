import type { InternalAxiosRequestConfig } from 'axios';
import { environment } from '@environments';

/**
 * Interceptor adding the API address to every request.
 */
export const apiPrefixInterceptor = (request: InternalAxiosRequestConfig) => {
  const noPrefixPaths = ['assets/'];
  const url = request.url ?? '';

  if (!/^(http|https)/i.test(url) && !noPrefixPaths.some((path) => url.startsWith(path))) {
    const noPrefixEndpoints = ['test/test']; // Endpoints without the v1 prefix

    const shouldAddPrefix = !noPrefixEndpoints.some((e) => url.startsWith(e));

    const prefix = shouldAddPrefix ? 'v1/' : '';

    request.url = environment.SERVER_URL + prefix + url;
  }

  return request;
};
