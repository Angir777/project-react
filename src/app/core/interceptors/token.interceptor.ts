import type { InternalAxiosRequestConfig } from 'axios';
import { credentialsService } from '../services/credentials.service';

/**
 * Interceptor adding the token when the user is logged in.
 */
export const tokenInterceptor = (request: InternalAxiosRequestConfig) => {
  if (credentialsService.getToken() != null) {
    request.headers.set('Authorization', `${credentialsService.getAuthHeader()}`);
  }

  return request;
};
