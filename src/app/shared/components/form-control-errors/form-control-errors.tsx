import { useTranslation } from 'react-i18next';
import type { FormErrors } from '../../helpers/validators';

export type { FormErrors } from '../../helpers/validators';

interface FormControlErrorsProps {
  /**
   * Object containing validation errors (Angular `ValidationErrors` shape).
   * Some validators also return the expected and actual value, e.g.
   * { min: { min: 1, actual: 0 } }
   */
  errors?: FormErrors | null;

  /**
   * Validation errors returned by the API (Laravel), ready to display.
   */
  serverErrors?: string[];

  /**
   * Custom translation for a given error, e.g.
   * { required: 'user.validation.customRequiredMessage' }
   */
  customValidationMessages?: Record<string, string>;
}

/**
 * Component displaying validation errors for forms.
 */
export function FormControlErrors({
  errors,
  serverErrors = [],
  customValidationMessages = {},
}: FormControlErrorsProps) {
  const { t } = useTranslation();

  const hasCustomErrorMessage = (key: string) => !!customValidationMessages[key];
  const key = (name: string) =>
    !hasCustomErrorMessage(name)
      ? `main.global.validation.${name}`
      : customValidationMessages[name];

  const hasServerErrors = !(serverErrors == null || serverErrors.length === 0);

  if (hasServerErrors) {
    return (
      <>
        {serverErrors.map((se) => (
          <small key={se} className="text-red-600">
            {se}
          </small>
        ))}
      </>
    );
  }

  return (
    <>
      {errors?.min && (
        <small className="text-red-600">{t(key('min'), { min: errors.min.min })}</small>
      )}

      {errors?.max && (
        <small className="text-red-600">{t(key('max'), { max: errors.max.max })}</small>
      )}

      {errors?.required && <small className="text-red-600">{t(key('required'))}</small>}

      {errors?.requiredTrue && <small className="text-red-600">{t(key('requiredTrue'))}</small>}

      {errors?.email && <small className="text-red-600">{t(key('email'))}</small>}

      {errors?.minlength && (
        <small className="text-red-600">
          {t(key('minlength'), { minlength: errors.minlength.requiredLength })}
        </small>
      )}

      {errors?.maxlength && (
        <small className="text-red-600">
          {t(key('maxlength'), { maxlength: errors.maxlength.requiredLength })}
        </small>
      )}

      {errors?.pattern && (
        <small className="text-red-600">
          {t(key('pattern'), { pattern: errors.pattern.requiredPattern })}
        </small>
      )}

      {errors?.mismatch && <small className="text-red-600">{t(key('mismatch'))}</small>}
    </>
  );
}
