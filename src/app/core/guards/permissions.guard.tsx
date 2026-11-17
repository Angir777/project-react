import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { usePermissions } from '../services/credentials.service';

interface PermissionsGuardProps {
  /** The user needs at least one of these permissions (ngx-permissions `only`). */
  only: string[];
  /** Where to go without permission. */
  redirectTo: string;
  children: ReactNode;
}

/**
 * Equivalent of `ngxPermissionsGuard` with `data.permissions = { only, redirectTo }`.
 */
export function PermissionsGuard({ only, redirectTo, children }: PermissionsGuardProps) {
  const permissions = usePermissions();

  if (!only.some((permission) => permissions.includes(permission))) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
