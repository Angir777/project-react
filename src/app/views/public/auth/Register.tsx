import { FC, useState } from 'react';
import * as yup from 'yup';
import { setGlobalState } from '../../../core/redux/hooks/reduxHooks';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RegisterInterface } from '../../../interfaces/register.interface';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { PrimeButtonLabel } from '../../../components/PrimeButtonLabel';
import AuthService from '../../../services/auth/auth.service';
import { toastActions } from '../../../core/redux/toast';
import { AuthUser } from '../../../models/auth/Auth';
import { authActions } from '../../../core/redux/auth';

const schema = yup.object().shape({
  name: yup.string().required('validation.required').max(191, 'validation.maxLength'), // Ograniczenie do 191 znaków
  email: yup.string().required('validation.required').email('validation.email').max(191, 'validation.maxLength'), // Ograniczenie do 191 znaków
  password: yup
    .string()
    .required('validation.required')
    .min(6, 'validation.minLength') // Minimalna długość 6 znaków
    .max(191, 'validation.maxLength'), // Ograniczenie do 191 znaków
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'validation.passwordMustMatch') // Sprawdzenie zgodności z hasłem
    .required('validation.required'),
  acceptance_regulations: yup
    .boolean()
    .oneOf([true], 'validation.required') // Musi być zaznaczone
    .required('validation.required'),
});

const Register: FC = () => {
  const dispatch = setGlobalState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RegisterInterface>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      acceptance_regulations: false,
    },
  });

  const onSubmit = async (formData: RegisterInterface) => {
    setIsRegistering(true);

    try {
      const res = await AuthService.register(formData);
      const data = res.data;

      if (!data.confirmed) {
        // Konto zostało utworzone pomyślnie, na adres email został wysłany link aktywacyjny.
        dispatch(
          toastActions.showToast({ 
            severity: 'success', 
            summary: t('toast.summary.success'), 
            detail: t('register.messages.success.accountCreatedNeedConfirmation') 
          })
        );
        navigate('/login', { replace: true });
        return;
      }

      const currentUser: AuthUser = {
        id: data.id,
        email: data.email,
        name: data.name,
        confirmed: data.confirmed,
        permissions: data.permissions,
        token: data.token,
        tokenType: data.tokenType,
        roles: data.roles,
      };

      // Witaj, {{name}}!
      dispatch(
        toastActions.showToast({ 
          severity: 'success', 
          summary: t('toast.summary.success'), 
          detail: t('login.messages.success.loginSuccess', { name: `${currentUser.name}` }) 
        })
      );

      // Ustawienie zalogowania
      dispatch(authActions.login(currentUser));

      // Przekierowanie na dashboard
      navigate('/dashboard/home', { replace: true });
    } catch {
      // Nie udało się utworzyć konta.
      dispatch(
        toastActions.showToast({ 
          severity: 'error', 
          summary: t('toast.summary.error'), 
          detail: t('register.messages.error.cantCreateAccount') 
        })
      );
    }

    setIsRegistering(false);
  };

  return (
    <>
      <div className="flex flex-column align-items-center justify-content-center">
        <div className="row light-blur-bg rounded-3 p-3 pb-4">
          <div className="col-12">
            <h3 className="mt-4 mb-4 text-center">{t('register.title')}</h3>
          </div>
          <div className="col-12">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="field p-fluid">
                  <label htmlFor="name">{t('register.form.name')}*</label>
                  <InputText
                    id="name"
                    {...register('name')}
                    className={`${errors.name ? 'p-invalid' : ''} p-inputtext-sm`}
                    placeholder={t('register.form.name')}
                  />
                  {errors.name && <small className="p-error">{t(errors.name.message || '')}</small>}
                </div>

                <div className="field p-fluid mt-3">
                  <label htmlFor="email-address">{t('register.form.email')}*</label>
                  <InputText
                    id="email"
                    {...register('email')}
                    className={`${errors.email ? 'p-invalid' : ''} p-inputtext-sm`}
                    placeholder={t('register.form.email')}
                  />
                  {errors.email && <small className="p-error">{t(errors.email.message || '')}</small>}
                </div>

                <div className="field p-fluid mt-3">
                  <label htmlFor="password">{t('register.form.password')}*</label>
                  <Password
                    id="password"
                    value={watch('password')}
                    onChange={(e) => setValue('password', e.target.value)}
                    feedback={false}
                    toggleMask
                    className={`${errors.password ? 'p-invalid' : ''} p-inputtext-sm`}
                    placeholder={t('register.form.password')}
                  />
                  {errors.password && <small className="p-error">{t(errors.password.message || '')}</small>}
                </div>

                <div className="field p-fluid mt-3">
                  <label htmlFor="password_confirmation">{t('register.form.passwordConfirmation')}*</label>
                  <Password
                    id="password_confirmation"
                    value={watch('password_confirmation')}
                    onChange={(e) => setValue('password_confirmation', e.target.value)}
                    feedback={false}
                    toggleMask
                    className={`${errors.password_confirmation ? 'p-invalid' : ''} p-inputtext-sm`}
                    placeholder={t('register.form.passwordConfirmation')}
                  />
                  {errors.password_confirmation && <small className="p-error">{t(errors.password_confirmation.message || '')}</small>}
                </div>
              </div>

              <div className="mt-3 d-flex align-items-start justify-content-between">
                <div className="mb-2">
                  <Checkbox
                    inputId="acceptance_regulations"
                    checked={!!watch('acceptance_regulations')}
                    onChange={(e) => setValue('acceptance_regulations', !!e.checked)}
                  />
                  <label htmlFor="acceptance_regulations" className="ms-2">
                    {t('register.form.acceptanceRegulations')}
                  </label>
                  <div>{errors.acceptance_regulations && <small className="p-error">{t(errors.acceptance_regulations.message || '')}</small>}</div>
                </div>

                <div className="mb-1">
                  <Link to="/" className="link-secondary link-underline-opacity-0">
                    {t('register.buttons.iHaveAccount')}
                  </Link>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Button severity="success" className="w-100 custom-button" disabled={isRegistering}>
                  <PrimeButtonLabel text={t('register.buttons.register')} loader={isRegistering} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
