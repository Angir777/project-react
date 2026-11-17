import type { ReactNode } from 'react';
import { usePermissions } from '@/core/services/credentials.service';

interface HasPermissionProps {
  /** Rendered when the user has at least one of these permissions (Angular: *ngxPermissionsOnly). */
  only: string[];
  children: ReactNode;
}

export function HasPermission({ only, children }: HasPermissionProps) {
  const permissions = usePermissions();

  if (!only.some((permission) => permissions.includes(permission))) {
    return null;
  }

  return <>{children}</>;
}
