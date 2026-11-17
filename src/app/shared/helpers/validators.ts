import * as yup from 'yup';
import type { FieldError } from 'react-hook-form';

/**
 * Validation errors in the same shape as Angular `ValidationErrors`
 * (consumed by `FormControlErrors`).
 */
export interface FormErrors {
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  min?: { min: number; actual: number };
  max?: { max: number; actual: number };
  minlength?: { requiredLength: number; actualLength: number };
  maxlength?: { requiredLength: number; actualLength: number };
  pattern?: { requiredPattern: string; actualValue: string };
  mismatch?: boolean;
}

/**
 * Yup messages encode the Angular validation error object, so `FormControlErrors`
 * can display exactly the same messages (with parameters) as the Angular app.
 */
const message = (errors: FormErrors) => JSON.stringify(errors);

/**
 * Equivalent of Angular `Validators` for yup schemas, e.g.
 * yup.string().required(Validators.required).max(191, Validators.maxLength(191))
 */
export const Validators = {
  required: message({ required: true }),
  requiredTrue: message({ requiredTrue: true }),
  email: message({ email: true }),
  mismatch: message({ mismatch: true }),
  min: (min: number) => message({ min: { min, actual: 0 } }),
  max: (max: number) => message({ max: { max, actual: 0 } }),
  minLength: (requiredLength: number) =>
    message({ minlength: { requiredLength, actualLength: 0 } }),
  maxLength: (requiredLength: number) =>
    message({ maxlength: { requiredLength, actualLength: 0 } }),
  pattern: (requiredPattern: string) => message({ pattern: { requiredPattern, actualValue: '' } }),
};

/**
 * Angular `Validators.email` equivalent (yup's `.email()` uses a different pattern).
 */
const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const emailValidator = <
  S extends yup.StringSchema<string | undefined, yup.AnyObject, unknown, yup.Flags>,
>(
  schema: S,
): S => schema.test('email', Validators.email, (value) => !value || EMAIL_REGEXP.test(value)) as S;

/**
 * Equivalent of the Angular `passwordMatchValidator()` group validator:
 * sets the `mismatch` error on `passwordConfirmation`.
 */
export const passwordMatchValidator = (passwordField = 'password') =>
  yup
    .string()
    .default('')
    .required(Validators.required)
    .test('mismatch', Validators.mismatch, function (value) {
      return !value || value === this.parent[passwordField];
    });

/**
 * Converts a react-hook-form field error into the Angular-like `FormErrors` object.
 */
export const toFormErrors = (error: FieldError | undefined): FormErrors | null => {
  if (!error?.message) {
    return null;
  }

  try {
    return JSON.parse(error.message) as FormErrors;
  } catch {
    return null;
  }
};
