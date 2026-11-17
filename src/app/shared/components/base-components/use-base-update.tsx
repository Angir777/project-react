import { useCallback, useState } from 'react';
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { FormHelper } from '../../helpers/form-helper';
import { toFormErrors } from '../../helpers/validators';
import { FormControlErrors } from '../form-control-errors/form-control-errors';

/**
 * Equivalent of the Angular `BaseUpdateComponent`, used with react-hook-form:
 * loading / saving / preview state, API (server) validation errors and helpers
 * to decide when a field is invalid.
 */
export function useBaseUpdate<T extends FieldValues>(form: UseFormReturn<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inPreview, setInPreview] = useState(false);

  const [error, setError] = useState<string | undefined>(undefined);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  // Subscribe to the form state used below.
  const { errors, touchedFields, dirtyFields, isSubmitted } = form.formState;

  /**
   * Redirects to the previous page
   */
  const previousState = useCallback(() => window.history.back(), []);

  const getServerErrors = useCallback(
    (name: string): string[] => FormHelper.getServerErrors(serverErrors, name),
    [serverErrors],
  );

  const clearServerErrors = useCallback((name: string) => {
    setServerErrors((current) => {
      if (!current || !Object.prototype.hasOwnProperty.call(current, name)) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  }, []);

  const isFormControlInvalid = (
    formControlName: FieldPath<T>,
    serverValidationPropName: string | null = null,
  ): boolean => {
    if (serverErrors !== null && serverValidationPropName !== null) {
      const fieldServerErrors = serverErrors[formControlName];
      if (fieldServerErrors && fieldServerErrors.length > 0) {
        return true;
      }
    }

    const error = FormHelper.getFieldError(errors, formControlName);
    const isTouched = !!FormHelper.getFieldError(touchedFields as never, formControlName);
    const isDirty = !!FormHelper.getFieldError(dirtyFields as never, formControlName);

    return FormHelper.isFormControlInvalid(error, isTouched, isDirty, isSubmitted);
  };

  /**
   * Validation errors of the given field (Angular: `form.get(name)?.errors`).
   */
  const getFormErrors = (formControlName: FieldPath<T>) =>
    toFormErrors(FormHelper.getFieldError(errors, formControlName));

  /**
   * Renders `<FormControlErrors>` when the field is invalid
   * (Angular: `@if (isFormControlInvalid(...)) { <app-form-control-errors ... /> }`).
   */
  const controlErrors = (formControlName: FieldPath<T>, serverValidationPropName?: string) =>
    isFormControlInvalid(formControlName, serverValidationPropName ?? formControlName) ? (
      <FormControlErrors
        errors={getFormErrors(formControlName)}
        serverErrors={getServerErrors(formControlName)}
      />
    ) : null;

  return {
    isLoading,
    setIsLoading,
    isSaving,
    setIsSaving,
    inPreview,
    setInPreview,
    error,
    setError,
    serverErrors,
    setServerErrors,
    previousState,
    getServerErrors,
    clearServerErrors,
    isFormControlInvalid,
    getFormErrors,
    controlErrors,
  };
}
