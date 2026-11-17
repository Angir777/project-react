import axios from 'axios';
import { apiPrefixInterceptor } from './api-prefix.interceptor';
import { apiUnavailableInterceptor } from './api-unavailable.interceptor';
import { authorizedInterceptor } from './authorized.interceptor';
import { errorHandlerInterceptor } from './error-handler.interceptor';
import { localeInterceptor } from './locale.interceptor';
import { tokenInterceptor } from './token.interceptor';

/**
 * HTTP client used by all services (Angular: HttpClient + `httpInterceptorProviders`).
 *
 * Axios runs request interceptors in reverse registration order and response interceptors
 * in registration order, so the lists below keep the Angular order:
 * request:  api-prefix -> locale -> token
 * response: error-handler -> authorized -> api-unavailable (unwinding like the Angular chain)
 */
export const http = axios.create();

// Request interceptors (registered in reverse order).
http.interceptors.request.use(tokenInterceptor);
http.interceptors.request.use(localeInterceptor);
http.interceptors.request.use(apiPrefixInterceptor);

// Response error interceptors.
http.interceptors.response.use(undefined, errorHandlerInterceptor);
http.interceptors.response.use(undefined, authorizedInterceptor);
http.interceptors.response.use(undefined, apiUnavailableInterceptor);
