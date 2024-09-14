import { Navigate, useLocation } from 'react-router-dom';
import { hasPermissions } from '../../utils/auth.utils';
import { getGlobalState } from '../redux/hooks/reduxHooks';

interface RequirePermissionProps {
  permissions: string[];
  element: JSX.Element;
}

export const RequirePermission = ({ element, permissions }: RequirePermissionProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentUser = getGlobalState((state: any) => state.auth.currentUser);
  const location = useLocation();

  // Nad sprawdzeniem, czy użytkownik jest zalogowany czuwa 'RequireAuth'
  if (currentUser) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userPermissions: string[] = currentUser.permissions.map((p: { name: any }) => p.name);
    const hasPermission = hasPermissions(userPermissions, permissions);
    if (!hasPermission) {
      return (
        <>
          (<Navigate to="/403" state={{ from: location }} replace />)
        </>
      );
    }
  }

  return <>{element}</>;
};
