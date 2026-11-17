import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '@/shadcn/components/ui/input';
import { Checkbox } from '@/shadcn/components/ui/checkbox';
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
  firstName: yup.string().default('').required(Validators.required),
  lastName: yup.string().default('').required(Validators.required),
  email: emailValidator(yup.string().default('').required(Validators.required)),
  password: yup.string().default('').required(Validators.required),
  passwordConfirmation: passwordMatchValidator('password'),
  acceptanceRegulations: yup.boolean().default(false).oneOf([true], Validators.requiredTrue),
  roles: yup.array(yup.string().required()).default(['teacher']).min(1, Validators.required),
});

type RegisterForm = yup.InferType<typeof schema>;

export function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State
  const [showPassword, setShowPassword] = useState(false);

  // Form
  const form = useForm<RegisterForm>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      acceptanceRegulations: false,
      roles: ['teacher'],
    },
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
  const submitForm = async (values: RegisterForm) => {
    setError('');
    setServerErrors({});
    setIsLoading(true);

    try {
      await authenticationService.register(values);

      toastService.show('success', 'auth.register.messages.success.registerSuccess');

      setTimeout(() => {
        navigate('/login');
      }, 1000);
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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div>
      <div className="mb-5 text-center sm:text-start">
        <h1>{t('auth.register.texts.signUp')}</h1>
        <p>{t('auth.register.texts.signUpInfo')}</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-3">
        {/* Alerts */}
        {!isLoading && error && (
          <ErrorAlert
            message={t('auth.register.messages.error.' + error)}
            onClose={() => setError('')}
          />
        )}

        {/* First name */}
        <div>
          <label htmlFor="firstName" className="text-sm font-medium">
            {t('auth.register.form.firstName')}
          </label>

          <Input
            {...form.register('firstName')}
            id="firstName"
            type="text"
            placeholder={t('auth.register.form.firstName')}
            className="w-full"
            aria-invalid={isFormControlInvalid('firstName', 'firstName') ? 'true' : undefined}
            onKeyDown={() => clearServerErrors('firstName')}
          />

          {controlErrors('firstName')}
        </div>

        {/* Last name */}
        <div>
          <label htmlFor="lastName" className="text-sm font-medium">
            {t('auth.register.form.lastName')}
          </label>

          <Input
            {...form.register('lastName')}
            id="lastName"
            type="text"
            placeholder={t('auth.register.form.lastName')}
            className="w-full"
            aria-invalid={isFormControlInvalid('lastName', 'lastName') ? 'true' : undefined}
            onKeyDown={() => clearServerErrors('lastName')}
          />

          {controlErrors('lastName')}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            {t('auth.register.form.email')}
          </label>

          <Input
            {...form.register('email')}
            id="email"
            type="email"
            placeholder={t('auth.register.form.email')}
            className="w-full"
            aria-invalid={isFormControlInvalid('email', 'email') ? 'true' : undefined}
            onKeyDown={() => clearServerErrors('email')}
          />

          {controlErrors('email')}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="text-sm font-medium">
            {t('auth.register.form.password')}
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
            {t('auth.register.form.passwordConfirmation')}
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

        {/* Accept terms and conditions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer select-none">
            <Controller
              control={form.control}
              name="acceptanceRegulations"
              render={({ field }) => (
                <Checkbox
                  id="acceptanceRegulations"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked === true);
                    field.onBlur();
                  }}
                  aria-invalid={
                    isFormControlInvalid('acceptanceRegulations', 'acceptanceRegulations')
                      ? 'true'
                      : undefined
                  }
                />
              )}
            />

            <label htmlFor="acceptanceRegulations" className="cursor-pointer select-none text-sm">
              {t('auth.register.form.acceptanceRegulations')}
            </label>
          </div>

          {controlErrors('acceptanceRegulations')}
        </div>

        {/* Create account */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={!form.formState.isValid || isLoading}
        >
          {t('auth.register.buttons.register')}
        </Button>
      </form>

      {/* Login */}
      <div className="mt-5">
        <p className="text-center sm:text-start text-sm text-primary">
          {t('auth.register.texts.haveAccount')}{' '}
          <Link to="/login" className="text-sm text-primary hover:underline">
            {t('auth.register.buttons.signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
