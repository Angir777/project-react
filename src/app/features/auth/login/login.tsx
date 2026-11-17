import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { environment } from '@environments';
import { Input } from '@/shadcn/components/ui/input';
import { Checkbox } from '@/shadcn/components/ui/checkbox';
import { Button } from '@/shadcn/components/ui/button';
import { Logger } from '@/core/services/logger.service';
import { useBaseUpdate } from '@/shared/components/base-components/use-base-update';
import { ErrorAlert } from '@/shared/components/ui/error-alert/error-alert';
import { PasswordInput } from '@/shared/components/ui/password-input/password-input';
import { Validators, emailValidator } from '@/shared/helpers/validators';
import { authenticationService } from '@/shared/services/authentication/authentication.service';
import { parseHttpError } from '@/shared/utils';

const log = new Logger('DAILO');

const schema = yup.object({
  email: emailValidator(yup.string().default('').required(Validators.required)),
  password: yup.string().default('').required(Validators.required),
  remember: yup.boolean().default(true),
});

type LoginForm = yup.InferType<typeof schema>;

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State
  const [showPassword, setShowPassword] = useState(false);
  const enableRegistration = environment.ENABLE_REGISTRATION;

  // Form
  const form = useForm<LoginForm>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '', remember: true },
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

  useEffect(() => {
    // Restore the remembered email
    const email = localStorage.getItem('REMEMBERED_EMAIL_APP');
    if (!email) return;

    form.setValue('email', email, { shouldValidate: true });
    form.setValue('remember', true);
  }, [form]);

  // Call the action
  const submitForm = async (values: LoginForm) => {
    setError('');
    setServerErrors({});
    setIsLoading(true);

    try {
      const { email } = await authenticationService.login(values);

      log.debug(`${email} successfully logged in!`);
      navigate('/dashboard');
    } catch (err) {
      log.debug('Login error.');

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
        <h1>{t('auth.login.texts.signIn')}</h1>
        <p>{t('auth.login.texts.signInInfo')}</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-3">
        {/* Alerts */}
        {!isLoading && error && (
          <ErrorAlert
            message={t('auth.login.messages.error.' + error)}
            onClose={() => setError('')}
          />
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            {t('auth.login.form.email')}
          </label>

          <Input
            {...form.register('email')}
            id="email"
            type="email"
            autoComplete="username"
            placeholder="example@email.com"
            className="w-full"
            aria-invalid={isFormControlInvalid('email', 'email') ? 'true' : undefined}
            onKeyDown={() => clearServerErrors('email')}
          />

          {controlErrors('email')}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="text-sm font-medium">
            {t('auth.login.form.password')}
          </label>

          <PasswordInput
            {...form.register('password')}
            id="password"
            placeholder="******"
            visible={showPassword}
            onToggleVisibility={() => setShowPassword(!showPassword)}
            aria-invalid={isFormControlInvalid('password', 'password') ? 'true' : undefined}
            onKeyDown={() => clearServerErrors('password')}
          />

          {controlErrors('password')}
        </div>

        {/* Remember me / Password reset */}
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex shrink-0 items-center gap-2">
            <Controller
              control={form.control}
              name="remember"
              render={({ field }) => (
                <Checkbox
                  id="remember"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  onBlur={field.onBlur}
                />
              )}
            />

            <label htmlFor="remember" className="cursor-pointer select-none text-sm">
              {t('auth.login.form.rememberMe')}
            </label>
          </div>

          <Link to="/password-reset" className="shrink-0 text-sm text-primary hover:underline">
            {t('auth.login.buttons.forgotPassword')}
          </Link>
        </div>

        {/* Log in */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={!form.formState.isValid || isLoading}
        >
          {t('auth.login.buttons.login')}
        </Button>
      </form>

      {/* No account yet? Create a new account */}
      {enableRegistration && (
        <div className="mt-5">
          <p className="text-center sm:text-start text-sm text-primary">
            {t('auth.login.texts.dontHaveAccount')}{' '}
            <Link to="/register" className="text-sm text-primary hover:underline">
              {t('auth.login.buttons.signUp')}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
