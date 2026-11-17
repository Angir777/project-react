import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Logger } from '../services/logger.service';
import { useCredentials } from '../services/credentials.service';

const log = new Logger('DAILO');

/**
 * Guard checking access to protected routes (Angular: AuthenticationGuard).
 */
export function AuthenticationGuard({ children }: { children: ReactNode }) {
  const credentials = useCredentials();
  const location = useLocation();

  if (credentials) {
    return <>{children}</>;
  }

  log.debug('Not authenticated, redirecting and adding redirect url.');

  const url = `${location.pathname}${location.search}`;

  return <Navigate to={`/login?redirect=${encodeURIComponent(url)}`} replace />;
}
