import { useSyncExternalStore } from 'react';

/**
 * Equivalent of the Angular CDK `BreakpointObserver.observe(query)`.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
