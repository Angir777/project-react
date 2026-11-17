import type { NavigateOptions, To } from 'react-router';

type NavigateFn = (to: To, options?: NavigateOptions) => void | Promise<void>;

let navigator: NavigateFn | null = null;

/**
 * Gives non-component code (services, HTTP interceptors) access to the router
 * (Angular: injecting `Router` in a service). Registered once in `App`.
 */
export const navigationService = {
  register(fn: NavigateFn) {
    navigator = fn;
  },

  navigate(to: To, options?: NavigateOptions) {
    if (navigator) {
      void navigator(to, options);
    } else {
      window.location.assign(typeof to === 'string' ? to : (to.pathname ?? '/'));
    }
  },
};
