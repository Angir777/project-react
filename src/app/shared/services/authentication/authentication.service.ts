import { http } from '@/core/interceptors';
import { credentialsService, type Credentials } from '@/core/services/credentials.service';
import { navigationService } from '@/core/services/navigation.service';
import type {
  AuthenticatedUser,
  FinishPasswordReset,
  PasswordReset,
  Register,
  User,
} from '../../interfaces';

export interface LoginContext {
  email: string;
  password: string;
  remember?: boolean;
}

const apiPrefix = 'auth';

/**
 * Equivalent of the Angular AuthenticationService.
 * Permissions are derived from the stored credentials (ngx-permissions equivalent),
 * so storing/clearing credentials also loads/flushes the permissions.
 */
export const authenticationService = {
  // Log in to the application.
  async login(context: LoginContext): Promise<Credentials> {
    const body = {
      email: context.email,
      password: context.password,
    };

    const res = await http.post<AuthenticatedUser>(`${apiPrefix}/login`, body);
    const user = res.data;

    const credentials: Credentials = {
      id: user.id ?? '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      token: user.token ?? '',
      permissions: user.permissions ?? [],
      roles: user.roles ?? [],
      avatarUrl: user.avatarUrl,
      settings: user.settings ?? {},
    };

    credentialsService.setCredentials(credentials, context.remember);

    if (context.remember) {
      localStorage.setItem('REMEMBERED_EMAIL_APP', context.email);
    } else {
      localStorage.removeItem('REMEMBERED_EMAIL_APP');
    }

    return credentials;
  },

  // Log out of the application.
  logOut(): boolean {
    // Clear credentials (and permissions).
    credentialsService.setCredentials();

    // Redirect.
    navigationService.navigate('/login');

    return true;
  },

  // Registration.
  register(data: Register) {
    return http.post<AuthenticatedUser>(`${apiPrefix}/register`, data);
  },

  // Confirm account.
  confirmAccount(code: string) {
    return http.get(`${apiPrefix}/confirm-account/` + code);
  },

  // Request a password reset.
  sendResetPasswordEmail(authenticationData: PasswordReset) {
    return http.post(`${apiPrefix}/send-reset-password-email/`, authenticationData);
  },

  // Reset the password.
  finishPasswordReset(authenticationData: FinishPasswordReset) {
    return http.post(`${apiPrefix}/finish-password-reset/`, authenticationData);
  },

  // Fetch the logged-in user's data.
  getCurrentUser() {
    return http.get<User>(`${apiPrefix}/current-user`);
  },

  // Show administrator email addresses on the login page.
  async getAdminsEmails(): Promise<string[]> {
    const res = await http.get<string[]>(`${apiPrefix}/admins-emails`);
    return res.data;
  },
};
