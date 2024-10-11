// import { NavItem } from "../models/NavItem";

import { PermissionModes } from "../constants/permission-modes.const";
import { NavItem } from "../interfaces/nav-item.interface";

// Funkcja sprawdzająca czy zalogowany użytkownik posiada dane uprawnienie
export const hasPermissions = (userPermissions: string[], requiredPermissions: string[]) => {
  if (requiredPermissions != null && requiredPermissions.length > 0) {
    const currentUserPermissions = userPermissions || [];

    let hasPermission = true;
    requiredPermissions.map((p) => {
      if (!currentUserPermissions.includes(p)) {
        hasPermission = false;
      }
      return p;
    });

    return hasPermission;
  } else {
    return true;
  }
};

export const checkNavbarWithPermissions = (userPermissions: string[] = [], navbar: NavItem[]) => {
  const newNavbar: NavItem[] = [];
  navbar.map(item => {
    if (item.permissions === null || item.permissions.length < 1) {
      if (item.items !== null && item.items && item.items.length > 0) {
        item.items = checkNavbarWithPermissions(userPermissions, item.items);
      }
      newNavbar.push(item);
    } else {
      const hasPermission = hasPermissions(userPermissions, item.permissions);
      if (hasPermission) {
        if (item.items !== null && item.items) {
          item.items = checkNavbarWithPermissions(userPermissions, item.items);
        }
        newNavbar.push(item);
      }
    }
    return item;
  });
  return newNavbar;
};

export const checkPermission = (itemPermissions: string[] | undefined, userPermissions: string[], permissionMode: string | undefined) => {
  if (itemPermissions == null || itemPermissions.length < 1) {
    return true;
  }

  switch (permissionMode) {
    case PermissionModes.AT_LEAST_ONE: {
      return itemPermissions.some((ai) => userPermissions.includes(ai));
    }

    case PermissionModes.ALL: {
      return itemPermissions.every((ai) => userPermissions.includes(ai));
    }

    case PermissionModes.EXCEPT_AT_LEAST_ONE: {
      return !itemPermissions.some((ai) => userPermissions.includes(ai));
    }

    case PermissionModes.EXCEPT_ALL: {
      return !itemPermissions.every((ai) => userPermissions.includes(ai));
    }

    default: {
      return false;
    }
  }
};
