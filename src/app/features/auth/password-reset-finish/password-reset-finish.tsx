import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '@/shadcn/components/ui/input';
import { Button } from '@/shadcn/components/ui/button';
import { credentialsService } from '@/core/services/credentials.service';
import { useBaseUpdate } from '@/shared/components/base-components/use-base-update';
import { ErrorAlert } from '@/shared/components/ui/error-alert/error-alert';
import { PasswordInput } from '@/shared/components/ui/password-input/password-input';
import { Validators, emailValidator, passwordMatchValidator } from '@/shared/helpers/validators';
import { authenticationService } from '@/shared/services/authentication/authentication.service';
import { toastService } from '@/shared/services/translated-toast/translated-toast.service';
import { parseHttpError } from '@/shared/utils';

const schema = yup.object({
  email: emailValidator(yup.string().default('').required(Validators.required)),
  password: yup.string().default('').required(Validators.required),
  passwordConfirmation: passwordMatchValidator('password'),
});

type PasswordResetFinishForm = yup.InferType<typeof schema>;

export function PasswordResetFinish() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();

  // State
  const [showPassword, setShowPassword] = useState(false);
  const token = params['code'] ?? '';

  // Form
  const form = useForm<PasswordResetFinishForm>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '', passwordConfirmation: '' },
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
  const submitForm = async (values: PasswordResetFinishForm) => {
    setError('');
    setServerErrors({});

    const data = {
      ...values,
      token,
    };

    setIsLoading(true);

    try {
      await authenticationService.finishPasswordReset(data);

      toastService.show(
        'success',
        'auth.passwordResetFinish.messages.success.passwordResetFinishSuccess',
      );

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      const parsed = parseHttpError(err);

      setError(parsed.message);
      setServerErrors(parsed.errors);
    } finally {
      setIsLoading(false);
      form.reset();
    }
  };

  const onSubmit = form.handleSubmit(submitForm, () => {
    setError('');
    setServerErrors({});
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div>
      <div className="mb-5 text-center sm:text-start">
        <h1>{t('auth.passwordResetFinish.texts.passwordResetFinish')}</h1>
        <p>{t('auth.passwordResetFinish.texts.passwordResetFinishInfo')}</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-3">
        {/* Alerts */}
        {!isLoading && error && (
          <ErrorAlert
            message={t('auth.passwordResetFinish.messages.error.' + error)}
            onClose={() => setError('')}
          />
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            {t('auth.passwordResetFinish.form.email')}
          </label>

          <Input
            {...form.register('email')}
            id="email"
            type="email"
            placeholder={t('auth.passwordResetFinish.form.email')}
            className="w-full"
            aria-invalid={isFormControlInvalid('email', 'email') ? 'true' : undefined}
            onKeyDown={() => clearServerErrors('email')}
          />

          {controlErrors('email')}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="text-sm font-medium">
            {t('auth.passwordResetFinish.form.password')}
          </label>

          <PasswordInput
            {...form.register('password', { deps: ['passwordConfirmation'] })}
            id="password"
            placeholder="******"
            visible={showPassword}
            onToggleVisibility={togglePasswordVisibility}
            aria-invalid={isFormControlInvalid('password', 'password') ? 'true' : undefined}
            onKeyDown={() => clearServerErrors('password')}
          />

          {controlErrors('password')}
        </div>

        {/* Password confirmation */}
        <div>
          <label htmlFor="passwordConfirmation" className="text-sm font-medium">
            {t('auth.passwordResetFinish.form.passwordConfirmation')}
          </label>

          <PasswordInput
            {...form.register('passwordConfirmation')}
            id="passwordConfirmation"
            placeholder="******"
            visible={showPassword}
            onToggleVisibility={togglePasswordVisibility}
            aria-invalid={
              isFormControlInvalid('passwordConfirmation', 'passwordConfirmation')
                ? 'true'
                : undefined
            }
            onKeyDown={() => clearServerErrors('passwordConfirmation')}
          />

          {controlErrors('passwordConfirmation')}
        </div>

        {/* Change password */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={!form.formState.isValid || isLoading}
        >
          {t('auth.passwordResetFinish.buttons.passwordResetFinish')}
        </Button>
      </form>

      {/* Login */}
      <div className="mt-5">
        <p className="text-center sm:text-start text-sm text-primary">
          {t('auth.passwordResetFinish.texts.haveAccount')}{' '}
          <Link to="/login" className="text-sm text-primary hover:underline">
            {t('auth.passwordResetFinish.buttons.signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
