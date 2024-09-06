import { Navigate, useLocation } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { getGlobalState } from '../redux/hooks/reduxHooks';

/**
 * Komponent zabezpieczający trasy. Wymaga zalogowania. Inaczej kieruje na stronę logowania.
 */
export const RequireAuth = ({ children }: PropsWithChildren<any>) => {
  const currentUser = getGlobalState((state) => state.auth.currentUser);
  const location = useLocation();

  return <>{currentUser === null ? <Navigate to="/login" state={{ from: location }} replace /> : children}</>;
};
