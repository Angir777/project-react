import { useMatches, type UIMatch } from 'react-router';

/**
 * Route metadata (Angular: route `data`).
 */
export interface RouteHandle {
  /** Breadcrumb / page title translation key. */
  breadcrumb?: string;
  /** Page description translation key (shown under the title in the breadcrumb hero). */
  description?: string;
  /** Whether the breadcrumb item is a link. */
  clickable?: boolean;
  /** Title translation key of the public (auth) pages. */
  title?: string;
}

export interface Breadcrumb {
  breadcrumb: string;
  description?: string;
  url: string;
  clickable?: boolean;
}

type HandleMatch = UIMatch<unknown, RouteHandle | undefined>;

/**
 * Equivalent of the Angular `BreadcrumbService`: builds breadcrumbs from the matched routes
 * that define `handle.breadcrumb` and have their own URL segment.
 */
export function useBreadcrumbs(): Breadcrumb[] {
  const matches = useMatches() as HandleMatch[];

  const breadcrumbs: Breadcrumb[] = [];
  let previousPathname = '';

  // Route data is inherited from parent routes (Angular: data of componentless
  // parents such as `administration` / `users` is inherited by their children).
  let inherited: RouteHandle = {};

  matches.forEach((match) => {
    const pathname = match.pathname.replace(/\/$/, '') || '/';
    const hasUrlSegment = pathname !== previousPathname && pathname !== '/';
    previousPathname = pathname;

    const handle: RouteHandle = { ...inherited, ...match.handle };
    inherited = handle;

    if (handle?.breadcrumb && hasUrlSegment) {
      breadcrumbs.push({
        breadcrumb: handle.breadcrumb,
        description: handle.description,
        url: pathname,
        clickable: handle.clickable === true,
      });
    }
  });

  return breadcrumbs;
}

/**
 * Breadcrumb of the deepest matched route (Angular: `route.snapshot.data['breadcrumb']`
 * of the last child, with data inherited from parent routes).
 */
export function useCurrentBreadcrumb(): string | undefined {
  const matches = useMatches() as HandleMatch[];

  for (let i = matches.length - 1; i >= 0; i--) {
    const breadcrumb = matches[i].handle?.breadcrumb;
    if (breadcrumb) {
      return breadcrumb;
    }
  }

  return undefined;
}
