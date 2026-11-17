import { http } from '@/core/interceptors';
import type { ChangePassword, User, UserSettings } from '../../interfaces';

const resourceUrl = 'account';

/**
 * Equivalent of the Angular AccountService.
 */
export const accountService = {
  // Update user data.
  updateDetailsUser(formData: FormData) {
    return http.put<User>(`${resourceUrl}/update-details-user`, formData);
  },

  // Change password
  changePassword(context: ChangePassword) {
    const body = {
      oldPassword: context.oldPassword,
      newPassword: context.newPassword,
      passwordConfirmation: context.passwordConfirmation,
    };

    return http.patch<User>(`${resourceUrl}/change-password`, body);
  },

  // Resend activation email
  resendConfirmationEmail() {
    return http.post<void>(`${resourceUrl}/resend-confirmation-email`, {});
  },

  // Delete account
  deleteAccount() {
    return http.delete<void>(`${resourceUrl}/delete-account`);
  },

  getUserSettings() {
    return http.get<UserSettings>(`${resourceUrl}/get-user-settings`);
  },

  updateUserSettings(data: Record<string, boolean>) {
    return http.patch<UserSettings>(`${resourceUrl}/update-user-settings`, data);
  },
};
