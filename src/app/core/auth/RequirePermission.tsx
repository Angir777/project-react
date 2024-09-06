import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  // Nad sprawdzeniem, czy użytkownik jest zalogowany czuwa 'RequireAuth'
  if (currentUser) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userPermissions: string[] = currentUser.permissions.map((p: { name: any }) => p.name);
    const hasPermission = hasPermissions(userPermissions, permissions);
    if (!hasPermission) {
      toast.error(t('global.messages.noAccess'), {
        toastId: 'GET_TABLE_DATA_ERROR_TOAST',
      });
      return (
        <>
          (<Navigate to="/" state={{ from: location }} replace />)
        </>
      );
    }
  }

  return <>{element}</>;
};
