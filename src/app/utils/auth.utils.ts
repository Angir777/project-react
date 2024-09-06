// import { NavItem } from "../models/NavItem";

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

// export const confrontNavbarWithPermissions = (userPermissions: string[] = [], navbar: NavItem[]) => {
//     const newNavbar: NavItem[] = [];
//     navbar.map(item => {
//         if (_.isNil(item.permissions) || item.permissions.length < 1) {
//             if (!_.isNil(item.items) && item.items.length > 0) {
//                 item.items = confrontNavbarWithPermissions(userPermissions, item.items);
//             }
//             newNavbar.push(item);
//         } else {
//             let hasPermission = hasPermissions(userPermissions, item.permissions);

//             if (hasPermission) {
//                 if (!_.isNil(item.items)) {
//                     item.items = confrontNavbarWithPermissions(userPermissions, item.items);
//                 }
//                 newNavbar.push(item);
//             }
//         }

//         return item;
//     });
//     return newNavbar;
// }
