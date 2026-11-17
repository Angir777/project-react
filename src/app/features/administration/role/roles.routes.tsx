import type { RouteObject } from 'react-router';
import type { RouteHandle } from '@/core/router/route-handle';
import { PermissionsGuard } from '@/core/guards/permissions.guard';

/**
 * Roles routing (lazy-loaded views, guarded by permissions)
 */
export const rolesRoutes: RouteObject[] = [
  {
    index: true,
    lazy: async () => {
      const { RolesList } = await import('./roles-list/roles-list');
      return {
        element: (
          <PermissionsGuard only={['ROLES_VIEW']} redirectTo="/">
            <RolesList />
          </PermissionsGuard>
        ),
      };
    },
  },
  {
    path: 'add',
    handle: { breadcrumb: 'role.pageTitle.add' } satisfies RouteHandle,
    lazy: async () => {
      const { UpdateRole } = await import('./update-role/update-role');
      return {
        element: (
          <PermissionsGuard only={['ROLES_CREATE']} redirectTo="/">
            <UpdateRole />
          </PermissionsGuard>
        ),
      };
    },
  },
  {
    path: 'edit/:id',
    handle: { breadcrumb: 'role.pageTitle.edit' } satisfies RouteHandle,
    lazy: async () => {
      const { UpdateRole } = await import('./update-role/update-role');
      return {
        element: (
          <PermissionsGuard only={['ROLES_UPDATE']} redirectTo="/">
            <UpdateRole />
          </PermissionsGuard>
        ),
      };
    },
  },
  {
    path: 'display/:id',
    handle: { breadcrumb: 'role.pageTitle.display' } satisfies RouteHandle,
    lazy: async () => {
      const { DisplayRole } = await import('./display-role/display-role');
      return {
        element: (
          <PermissionsGuard only={['ROLES_VIEW']} redirectTo="/">
            <DisplayRole />
          </PermissionsGuard>
        ),
      };
    },
  },
];
