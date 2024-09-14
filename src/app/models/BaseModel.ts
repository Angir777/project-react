/**
 * Bazowy model.
 */
export class BaseModel {
  id: number | null = null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;

  isSaving?: boolean;
  isDeleting?: boolean;
}
