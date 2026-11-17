/**
 * Authenticated user user interface.
 */
export interface AuthenticatedUser {
  id?: number | string | null;
  firstName: string;
  lastName: string;
  email: string;
  token?: string;
  permissions: string[];
  roles: string[];
  avatarUrl: string | null;
  settings: Record<string, boolean>;
}
