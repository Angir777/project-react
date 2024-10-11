import { FC, useCallback, useEffect, useState } from 'react';
import { NavItem } from '../../../interfaces/nav-item.interface';
import { PermissionModes } from '../../../constants/permission-modes.const';
import { getGlobalState } from '../../../core/redux/hooks/reduxHooks';
import { checkPermission } from '../../../utils/auth.utils';
import Menuitem from './Menuitem';

const Menu: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model: NavItem[] = [
    {
      label: 'pageTitle.homePage',
      permissions: ['USER'],
      permissionsMode: PermissionModes.AT_LEAST_ONE,
      items: [
        {
          label: 'pageTitle.dashboard',
          icon: 'home',
          to: '/dashboard/home',
          permissions: ['USER'],
          permissionsMode: PermissionModes.AT_LEAST_ONE,
        },
      ],
    },
    {
      separator: true,
      label: '',
      permissions: [],
      permissionsMode: '',
    },
    {
      label: 'pageTitle.userManagement',
      permissions: ['USER_MANAGE', 'USER_ACCESS', 'ROLE_MANAGE', 'ROLE_ACCESS'],
      permissionsMode: PermissionModes.AT_LEAST_ONE,
      items: [
        {
          label: 'pageTitle.users',
          icon: 'user',
          to: '/users',
          permissions: ['USER_MANAGE', 'USER_ACCESS'],
          permissionsMode: PermissionModes.AT_LEAST_ONE,
        },
        {
          label: 'pageTitle.roles',
          icon: 'shield',
          to: '/roles',
          permissions: ['ROLE_MANAGE', 'ROLE_ACCESS'],
          permissionsMode: PermissionModes.AT_LEAST_ONE,
        },
      ],
    },
    {
      label: 'MENU 1',
      permissions: ['USER'],
      permissionsMode: PermissionModes.AT_LEAST_ONE,
      items: [
        {
          label: 'MENU 2',
          icon: 'user-cog',
          to: '/dashboard/',
          permissions: ['USER'],
          permissionsMode: PermissionModes.AT_LEAST_ONE,
          // Dodajemy dzieci do elementu 'Profile'
          items: [
            {
              label: 'Settings',
              icon: 'info-circle',
              to: '/dashboard/settings',
              permissions: ['USER'],
              permissionsMode: PermissionModes.AT_LEAST_ONE,
            },
          ],
        },
      ],
    },
  ];

  const permissions = getGlobalState((state) => state.auth.currentUser?.permissions);
  const [availableNavigation, setAvailableNavigation] = useState<NavItem[]>([]);

  const filterNavItems = useCallback((navItems: NavItem[], userPermissions: string[]): NavItem[] => {
    return navItems.filter((item) => {
      if (item.items) {
        item.items = filterNavItems(item.items, userPermissions);
      }
      if (item.permissions) {
        return checkPermission(item.permissions, userPermissions, item.permissionsMode);
      }
      return true;
    });
  }, []);

  const prepareNav = useCallback(() => {
    if (permissions !== null && model !== null) {
      const userPermissions: string[] = permissions ? permissions.map((p) => p.name) : [];
      const filteredNavigation = filterNavItems(model, userPermissions);

      setAvailableNavigation(filteredNavigation);
    }
  }, [permissions, filterNavItems]);

  useEffect(() => {
    prepareNav();
  }, [permissions, prepareNav]);

  return (
    <ul className="layout-menu">
      {availableNavigation.map((item, i) => {
        return !item?.separator ? <Menuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator" key={i}></li>;
      })}
    </ul>
  );
};

export default Menu;
