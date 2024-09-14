import { User } from '../user/User';

/**
 * Model użytkownika z dodatkiem informacji o tokenie.
 */
export class AuthUser extends User {
  token: string | null = null;
  tokenType: string | null = null;
}