import { ReactNode } from 'react';
import { getGlobalState } from '../redux/hooks/reduxHooks';
import { hasPermissions } from '../../utils/auth.utils';

interface HasPermissionProps {
  children?: ReactNode | undefined;
  permissions: string[];
}

export const HasPermission = ({ children, permissions }: HasPermissionProps) => {
  const currentUser = getGlobalState((state: { auth: { currentUser: any } }) => state.auth.currentUser);

  if (currentUser == null) {
    return null;
  }

  if (
    hasPermissions(
      currentUser.permissions.map((p: { name: any }) => p.name),
      permissions
    )
  ) {
    return <>{children}</>;
  }

  return null;
};
