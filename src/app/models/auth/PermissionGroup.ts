import { Permission } from './Permission';

export interface PermissionGroup {
  name: string | null;
  permissions: Permission[];
}
