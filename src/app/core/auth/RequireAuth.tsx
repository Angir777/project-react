import { Navigate, useLocation } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { getGlobalState } from '../redux/hooks/reduxHooks';

/**
 * Komponent zabezpieczający trasy. Wymaga zalogowania. Inaczej kieruje na stronę logowania.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RequireAuth = ({ children }: PropsWithChildren<any>) => {
  const currentUser = getGlobalState((state) => state.auth.currentUser);
  const location = useLocation();

  return <>{currentUser === null ? <Navigate to="/login" state={{ from: location }} replace /> : children}</>;
};
