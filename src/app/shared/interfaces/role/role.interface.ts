import type { Permission } from '../auth/permission.interface';
import type { BaseModel } from '../base-model.interface';

/**
 * Role model interface.
 */
export interface Role extends BaseModel {
  name: string;
  translatedName?: string;
  guardName?: string;
  permissions?: Permission[];

  isSelected?: boolean;
}
