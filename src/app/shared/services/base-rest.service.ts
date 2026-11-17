/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from 'axios';
import { http } from '@/core/interceptors';
import type { PaginatedResponse } from '../interfaces';
import { prepareRequestParams, type RequestParams } from '../utils';

export interface BaseRestService<T> {
  readonly resourceUrl: string;
  getAll(req?: RequestParams): Promise<AxiosResponse<T[]>>;
  query(req?: RequestParams): Promise<AxiosResponse<PaginatedResponse<T>>>;
  queryDeleted(req?: RequestParams): Promise<AxiosResponse<PaginatedResponse<T>>>;
  getById(id: any, req?: RequestParams): Promise<AxiosResponse<T>>;
  create(postData: T, req?: RequestParams): Promise<AxiosResponse<T>>;
  update(postData: T, req?: RequestParams): Promise<AxiosResponse<T>>;
  delete(id: any, req?: RequestParams): Promise<AxiosResponse<any>>;
  getHistory(id: number | string, req?: RequestParams): Promise<AxiosResponse<any>>;
}

/**
 * Equivalent of the abstract Angular `BaseRestService<T>`:
 * creates the standard REST methods for the given resource.
 */
export const createRestService = <T>(resourceUrl: string): BaseRestService<T> => ({
  resourceUrl,

  getAll(req) {
    return http.get<T[]>(`${resourceUrl}/get-all`, { params: prepareRequestParams(req) });
  },

  query(req) {
    return http.get<PaginatedResponse<T>>(`${resourceUrl}`, {
      params: prepareRequestParams(req),
    });
  },

  queryDeleted(req) {
    return http.get<PaginatedResponse<T>>(`${resourceUrl}/deleted`, {
      params: prepareRequestParams(req),
    });
  },

  getById(id, req) {
    return http.get<T>(`${resourceUrl}/${id}`, { params: prepareRequestParams(req) });
  },

  create(postData, req) {
    return http.post<T>(`${resourceUrl}`, postData, { params: prepareRequestParams(req) });
  },

  update(postData, req) {
    return http.put<T>(`${resourceUrl}/${(postData as any).id}`, postData, {
      params: prepareRequestParams(req),
    });
  },

  delete(id, req) {
    return http.delete<any>(`${resourceUrl}/${id}`, { params: prepareRequestParams(req) });
  },

  getHistory(id, req) {
    return http.get<any>(`${resourceUrl}/history/${id}`, { params: prepareRequestParams(req) });
  },
});
