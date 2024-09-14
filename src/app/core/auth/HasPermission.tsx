import { ReactNode } from 'react';
import { getGlobalState } from '../redux/hooks/reduxHooks';
import { hasPermissions } from '../../utils/auth.utils';

interface HasPermissionProps {
  children?: ReactNode | undefined;
  permissions: string[];
}

export const HasPermission = ({ children, permissions }: HasPermissionProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentUser = getGlobalState((state: { auth: { currentUser: any } }) => state.auth.currentUser);

  if (currentUser == null) {
    return null;
  }

  if (
    hasPermissions(
      currentUser.permissions.map((p: { name: string }) => p.name),
      permissions
    )
  ) {
    return <>{children}</>;
  }

  return null;
};
