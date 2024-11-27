import { PermissionGroup } from "./PermissionGroup";

export interface Permission {
  id?: number | null;
  name: string | null;
  permissionGroup: PermissionGroup | null;
  permissionGroupName: string | null;
  isSelected?: boolean;
}
