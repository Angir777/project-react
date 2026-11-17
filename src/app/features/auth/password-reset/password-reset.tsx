import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { environment } from '@environments';
import { Input } from '@/shadcn/components/ui/input';
import { Button } from '@/shadcn/components/ui/button';
import { credentialsService } from '@/core/services/credentials.service';
import { useBaseUpdate } from '@/shared/components/base-components/use-base-update';
import { ErrorAlert } from '@/shared/components/ui/error-alert/error-alert';
import { Validators, emailValidator } from '@/shared/helpers/validators';
import { authenticationService } from '@/shared/services/authentication/authentication.service';
import { toastService } from '@/shared/services/translated-toast/translated-toast.service';
import { parseHttpError } from '@/shared/utils';

const schema = yup.object({
  email: emailValidator(yup.string().default('').required(Validators.required)),
});

type PasswordResetForm = yup.InferType<typeof schema>;

export function PasswordReset() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form
  const form = useForm<PasswordResetForm>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });

  const {
    isLoading,
    setIsLoading,
    error,
    setError,
    setServerErrors,
    clearServerErrors,
    isFormControlInvalid,
    controlErrors,
  } = useBaseUpdate(form);

  // If the user is logged in, redirect to the home page
  useEffect(() => {
    if (credentialsService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Call the action
  const submitForm = async (values: PasswordResetForm) => {
    setError('');
    setServerErrors({});

    const payload = {
      ...values,
      gatewayUrl: environment.APP_URL,
    };

    setIsLoading(true);

    try {
      await authenticationService.sendResetPasswordEmail(payload);

      toastService.show('success', 'auth.passwordReset.messages.success.passwordResetSuccess');

      form.reset();
    } catch (err) {
      const parsed = parseHttpError(err);

      setError(parsed.message);
      setServerErrors(parsed.errors);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = form.handleSubmit(submitForm, () => {
    setError('');
    setServerErrors({});
  });

  return (
    <div>
      <div className="mb-5 text-center sm:text-start">
        <h1>{t('auth.passwordReset.texts.passwordReset')}</h1>
        <p>{t('auth.passwordReset.texts.passwordResetInfo')}</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-3">
        {/* Alerts */}
        {!isLoading && error && (
          <ErrorAlert
            message={t('auth.passwordReset.messages.error.' + error)}
            onClose={() => setError('')}
          />
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            {t('auth.passwordReset.form.email')}
          </label>

          <Input
            {...form.register('email')}
            id="email"
            type="email"
            placeholder={t('auth.passwordReset.form.email')}
            className="w-full"
            aria-invalid={isFormControlInvalid('email', 'email') ? 'true' : undefined}
            onKeyDown={() => clearServerErrors('email')}
          />

          {controlErrors('email')}
        </div>

        {/* Reset my password */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={!form.formState.isValid || isLoading}
        >
          {t('auth.passwordReset.buttons.passwordReset')}
        </Button>
      </form>

      {/* Login */}
      <div className="mt-5">
        <p className="text-center sm:text-start text-sm text-primary">
          {t('auth.passwordReset.texts.rememberPassword')}{' '}
          <Link to="/login" className="text-sm text-primary hover:underline">
            {t('auth.passwordReset.buttons.signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
