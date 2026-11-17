import type { BaseApiModel } from './api/base-api-model.interface';

export interface BaseModel extends BaseApiModel {
  isDeleting?: boolean;
  isProcessing?: boolean;
  isRestoring?: boolean;
}
