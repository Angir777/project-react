/**
 * Registration interface.
 */
export interface Register {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  acceptanceRegulations: boolean;
}
