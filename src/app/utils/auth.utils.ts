import { PermissionModes } from "../constants/permission-modes.const";

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

// Funkcja weryfikująca uprawnienie użytkownika na danej pozycji menu według ustawionego schematu
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
