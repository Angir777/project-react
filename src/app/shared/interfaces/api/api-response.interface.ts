/**
 * An interface that defines the "shape" of basic responses from the API.
 */

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
  pageSize: number;
}
