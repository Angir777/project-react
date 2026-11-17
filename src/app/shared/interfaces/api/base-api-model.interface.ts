/**
 * An interface defining the basic "shape" of the model for data from the API.
 */
export interface BaseApiModel {
  id?: number | string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
