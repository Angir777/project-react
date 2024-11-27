import { Permission } from '../auth/Permission';
import { BaseModel } from '../BaseModel';

/**
 * Model od ról.
 */
export class Role extends BaseModel {
  name: string | null = null;
  guardName: string | null = null;
  permissions: Permission[] = [];
  permissionIds?: number[];
  isSelected?: boolean;
}
