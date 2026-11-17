import type { RouteObject } from 'react-router';
import type { RouteHandle } from '@/core/router/route-handle';
import { PermissionsGuard } from '@/core/guards/permissions.guard';

/**
 * Users routing (lazy-loaded views, guarded by permissions)
 */
export const usersRoutes: RouteObject[] = [
  {
    index: true,
    lazy: async () => {
      const { UsersList } = await import('./users-list/users-list');
      return {
        element: (
          <PermissionsGuard only={['USERS_VIEW']} redirectTo="/">
            <UsersList />
          </PermissionsGuard>
        ),
      };
    },
  },
  {
    path: 'deleted',
    handle: { breadcrumb: 'user.pageTitle.deleted' } satisfies RouteHandle,
    lazy: async () => {
      const { DeletedUsersList } = await import('./deleted-users-list/deleted-users-list');
      return {
        element: (
          <PermissionsGuard only={['USERS_VIEW']} redirectTo="/">
            <DeletedUsersList />
          </PermissionsGuard>
        ),
      };
    },
  },
  {
    path: 'add',
    handle: { breadcrumb: 'user.pageTitle.add' } satisfies RouteHandle,
    lazy: async () => {
      const { UpdateUser } = await import('./update-user/update-user');
      return {
        element: (
          <PermissionsGuard only={['USERS_CREATE']} redirectTo="/">
            <UpdateUser />
          </PermissionsGuard>
        ),
      };
    },
  },
  {
    path: 'edit/:id',
    handle: { breadcrumb: 'user.pageTitle.edit' } satisfies RouteHandle,
    lazy: async () => {
      const { UpdateUser } = await import('./update-user/update-user');
      return {
        element: (
          <PermissionsGuard only={['USERS_UPDATE']} redirectTo="/">
            <UpdateUser />
          </PermissionsGuard>
        ),
      };
    },
  },
  {
    path: 'display/:id',
    handle: { breadcrumb: 'user.pageTitle.display' } satisfies RouteHandle,
    lazy: async () => {
      const { DisplayUser } = await import('./display-user/display-user');
      return {
        element: (
          <PermissionsGuard only={['USERS_VIEW']} redirectTo="/">
            <DisplayUser />
          </PermissionsGuard>
        ),
      };
    },
  },
];
