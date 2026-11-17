import type { RouteObject } from 'react-router';
import type { RouteHandle } from '@/core/router/route-handle';
import { Login } from './login/login';
import { Register } from './register/register';
import { ConfirmAccount } from './confirm-account/confirm-account';
import { PasswordReset } from './password-reset/password-reset';
import { PasswordResetFinish } from './password-reset-finish/password-reset-finish';

/**
 * Auth routing
 */
export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <Login />,
    handle: { title: 'auth.pageTitle.login' } satisfies RouteHandle,
  },
  {
    path: 'register',
    element: <Register />,
    handle: { title: 'auth.pageTitle.register' } satisfies RouteHandle,
  },
  {
    path: 'confirm-account/:code',
    element: <ConfirmAccount />,
    handle: { title: 'auth.pageTitle.confirmAccount' } satisfies RouteHandle,
  },
  {
    path: 'password-reset',
    element: <PasswordReset />,
    handle: { title: 'auth.pageTitle.passwordReset' } satisfies RouteHandle,
  },
  {
    path: 'password-reset-finish/:code',
    element: <PasswordResetFinish />,
    handle: { title: 'auth.pageTitle.passwordResetFinish' } satisfies RouteHandle,
  },
];
