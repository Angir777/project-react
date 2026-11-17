import { Navigate, type RouteObject } from 'react-router';
import type { RouteHandle } from './core/router/route-handle';
import { AuthenticationGuard } from './core/guards/authentication.guard';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { ErrorLayout } from './layout/error-layout/error-layout';
import { PublicLayout } from './layout/public-layout/public-layout';
import { NotFound } from './features/error/not-found/not-found';
import { Dashboard } from './features/dashboard/dashboard';
import { Account } from './features/account/account';
import { authRoutes } from './features/auth/auth.routes';
import { administrationRoutes } from './features/administration/administration.routes';

/**
 * Application routes (Angular: app.routes.ts).
 * Route metadata (breadcrumb, description, clickable) is kept in `handle`.
 */
export const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/dashboard" replace />,
  },

  // Public routes
  {
    element: <PublicLayout />,
    children: authRoutes,
  },

  // Protected Routes
  {
    element: (
      <AuthenticationGuard>
        <DashboardLayout />
      </AuthenticationGuard>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
        handle: {
          breadcrumb: 'main.dashboard.pageTitle.dashboard',
          description: 'main.dashboard.pageDescription.dashboard',
          clickable: false,
        } satisfies RouteHandle,
      },
      {
        path: 'account',
        element: <Account />,
        handle: {
          breadcrumb: 'account.pageTitle.account',
          description: 'account.pageDescription',
          clickable: false,
        } satisfies RouteHandle,
      },
      {
        path: 'administration',
        // Route definitions are static (React Router cannot lazy-load `children`);
        // the administration views themselves are lazy-loaded.
        children: administrationRoutes,
        handle: {
          breadcrumb: 'nav.administration',
          description: 'nav.pageDescription.administration',
          clickable: false,
        } satisfies RouteHandle,
      },
    ],
  },

  // Error Routes
  {
    path: 'error',
    element: <ErrorLayout />,
    children: [{ path: '404', element: <NotFound /> }],
  },

  // Wildcard
  { path: '*', element: <Navigate to="/error/404" replace /> },
];
