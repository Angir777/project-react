import type { FieldError, FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form';

/**
 * React-hook-form counterpart of the Angular `FormHelper`.
 */
export class FormHelper {
  /**
   * Marks every registered field as touched (equivalent of markAsTouched on all controls)
   * by triggering validation of the whole form.
   */
  public static async validateAllFormFields<T extends FieldValues>(
    form: UseFormReturn<T>,
  ): Promise<boolean> {
    return form.trigger(undefined, { shouldFocus: false });
  }

  public static isFormControlInvalid(
    error: FieldError | undefined,
    isTouched: boolean,
    isDirty: boolean,
    isSubmitted: boolean,
  ): boolean {
    if (!error) {
      return false;
    }

    return isDirty || isTouched || isSubmitted;
  }

  public static getValidationWrapperClass(isInvalid: boolean) {
    return isInvalid
      ? 'border-red-600 hover:border-red-600 focus:border-red-600'
      : 'border-green-500 hover:border-green-600 focus:border-green-600';
  }

  public static getValidationClass(isInvalid: boolean) {
    return isInvalid
      ? 'border-red-600 hover:border-red-600 focus:border-red-600'
      : 'border-green-500 hover:border-green-600 focus:border-green-600';
  }

  public static getServerErrors(
    serverErrors: Record<string, string[]>,
    propName: string,
  ): string[] {
    if (this.hasProp(serverErrors, propName)) {
      return serverErrors[propName];
    }
    return [];
  }

  /**
   * Gets a nested field error by path ('a.b.0').
   */
  public static getFieldError<T extends FieldValues>(
    errors: FieldErrors<T>,
    path: string,
  ): FieldError | undefined {
    return path
      .split('.')
      .reduce<unknown>(
        (acc, key) => (acc as Record<string, unknown> | undefined)?.[key],
        errors,
      ) as FieldError | undefined;
  }

  private static hasProp(obj: Record<string, string[]>, prop: string): boolean {
    return obj != null && Object.prototype.hasOwnProperty.call(obj, prop);
  }
}
