/**
 * Password reset completion interface.
 */
export interface FinishPasswordReset {
  email: string;
  password: string;
  passwordConfirmation: string;
  token: string;
}
