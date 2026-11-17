import { useMediaQuery } from '@/shared/hooks/use-media-query';

/**
 * Mobile breakpoint used by the sidebar (zardui: `(max-width: 767.98px)`).
 */
const MOBILE_QUERY = '(max-width: 767.98px)';

export function useIsMobile() {
  return useMediaQuery(MOBILE_QUERY);
}
