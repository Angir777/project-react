import { PermissionModes } from '../../constants/permission-modes.const';
import type { NavItem } from '../../interfaces';

/**
 * Check permissions (also used by the permission guard and <HasPermission>).
 */
export const checkPermission = (
  itemPermissions: string[] = [],
  userPermissions: string[],
  permissionMode: PermissionModes = PermissionModes.AT_LEAST_ONE,
): boolean => {
  if (!itemPermissions.length) {
    return true;
  }

  switch (permissionMode) {
    case PermissionModes.AT_LEAST_ONE:
      return itemPermissions.some((permission) => userPermissions.includes(permission));

    case PermissionModes.ALL:
      return itemPermissions.every((permission) => userPermissions.includes(permission));

    case PermissionModes.EXCEPT_AT_LEAST_ONE:
      return !itemPermissions.some((permission) => userPermissions.includes(permission));

    case PermissionModes.EXCEPT_ALL:
      return !itemPermissions.every((permission) => userPermissions.includes(permission));

    default:
      return false;
  }
};

/**
 * Equivalent of the Angular SidebarMenuService.
 */
export const sidebarMenuService = {
  // Prepare menu items
  prepareMenu(items: NavItem[], userPermissions: string[]): NavItem[] {
    return items
      .map((item) => {
        const hasPermission = checkPermission(
          item.permissions,
          userPermissions,
          item.permissionsMode,
        );

        if (!hasPermission) {
          return null;
        }

        let filteredSubItems = item.subItems;

        if (item.subItems?.length) {
          filteredSubItems = item.subItems.filter((subItem) =>
            checkPermission(subItem.permissions, userPermissions, subItem.permissionsMode),
          );
        }

        return {
          ...item,
          subItems: filteredSubItems,
        };
      })
      .filter(Boolean) as NavItem[];
  },
};
