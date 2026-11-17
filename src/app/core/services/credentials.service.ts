import { environment } from '@environments';
import { store, credentialsActions, useAppSelector, type Credentials } from '../store';

export type { Credentials } from '../store';

const tokenType = 'Bearer';
const credentialsKey = 'CREDENTIALS-APP-' + environment.APP_STORAGE_PREFIX;

const getCredentials = (): Credentials | null => store.getState().credentials.credentials;

/**
 * Equivalent of the Angular CredentialsService.
 * Reads/writes the credentials stored in Redux and persists them in session/localStorage.
 */
export const credentialsService = {
  /**
   * Restores credentials saved in the storage (Angular: CredentialsService constructor).
   */
  init() {
    const savedCredentials =
      sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);

    if (savedCredentials) {
      store.dispatch(credentialsActions.setCredentials(JSON.parse(savedCredentials)));
    }
  },

  get credentials(): Credentials | null {
    return getCredentials();
  },

  getUserId(): number | string | null {
    return getCredentials()?.id ?? null;
  },

  getToken() {
    return getCredentials()?.token ?? null;
  },

  getAuthHeader() {
    const credentials = getCredentials();

    if (credentials != null) {
      return `${tokenType} ${credentials.token}`;
    }

    return null;
  },

  getPermissions() {
    return getCredentials()?.permissions ?? [];
  },

  getRoles() {
    return getCredentials()?.roles ?? [];
  },

  setCredentials(credentials?: Credentials, remember?: boolean) {
    store.dispatch(credentialsActions.setCredentials(credentials || null));

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;

      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  },

  checkUserPermission(permissionName: string): boolean {
    return getCredentials()?.permissions?.includes(permissionName) ?? false;
  },

  checkUserRole(roleName: string): boolean {
    return getCredentials()?.roles?.includes(roleName) ?? false;
  },

  isAuthenticated(): boolean {
    return !!getCredentials();
  },
};

/**
 * Reactive access to the credentials (Angular: `credentialsSignal`).
 */
export const useCredentials = () => useAppSelector((state) => state.credentials.credentials);

const EMPTY_PERMISSIONS: string[] = [];

/**
 * Permissions of the logged-in user (Angular: permissions loaded into ngx-permissions).
 */
export const usePermissions = () =>
  useAppSelector((state) => state.credentials.credentials?.permissions ?? EMPTY_PERMISSIONS);
