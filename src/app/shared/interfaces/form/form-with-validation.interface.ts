export interface FormWithValidation {
  /**
   * Check whether the input is filled in correctly
   * @param formControlName input name "formControlName"
   * @param serverValidationPropName name of the attribute validated by the API
   *
   * serverValidationPropName is required because for two-word
   * names the prop may look like userName in Angular, while in Laravel it will be user_name
   */
  isFormControlInvalid(formControlName: string, serverValidationPropName?: string): boolean;

  /**
   * Returns the validation class 'is-valid' | 'is-invalid' depending on whether the input is valid
   * @param formControlName input name
   * @param serverValidationPropName name of the attribute validated by the API
   *
   * serverValidationPropName is required because for two-word
   * names the prop may look like userName in Angular, while in Laravel it will be user_name
   */
  getFormValidationClass(formControlName: string, serverValidationPropName?: string): string | null;

  /**
   * Returns the validation errors returned by the API, if any, or an empty array;
   * for a form without API-side validation, the implementation can be omitted
   * @param propName attribute name
   */
  getServerErrors(propName: string): string[] | null;

  /**
   * Clears the prop in the object of validation errors returned by the API
   * @param propName prop name
   */
  clearServerErrors(propName: string): void;
}
