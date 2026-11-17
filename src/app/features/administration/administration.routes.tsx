import type { RouteObject } from 'react-router';
import type { RouteHandle } from '@/core/router/route-handle';
import { usersRoutes } from './user/users.routes';
import { rolesRoutes } from './role/roles.routes';

/**
 * Administration routing
 */
export const administrationRoutes: RouteObject[] = [
  {
    path: 'users',
    children: usersRoutes,
    handle: {
      breadcrumb: 'user.pageTitle.users',
      description: 'user.pageDescription.users',
      clickable: true,
    } satisfies RouteHandle,
  },
  {
    path: 'roles',
    children: rolesRoutes,
    handle: {
      breadcrumb: 'role.pageTitle.roles',
      description: 'role.pageDescription.roles',
      clickable: true,
    } satisfies RouteHandle,
  },
];
