import { FC, useState } from 'react';
import * as yup from 'yup';
import { APP_IS_REGISTER_ENABLED, APP_VERSION } from '../../../../envrionment';
import { setGlobalState } from '../../../core/redux/hooks/reduxHooks';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthUser } from '../../../models/auth/Auth';
import { LoginInterface } from '../../../interfaces/login.interface';
import AuthService from '../../../services/auth/auth.service';
import { authActions } from '../../../core/redux/auth';
import { toastActions } from '../../../core/redux/toast';
import { Button } from 'primereact/button';
import { PrimeButtonLabel } from '../../../components/PrimeButtonLabel';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import './Login.scss';

const schema = yup.object().shape({
  email: yup.string().required('validation.required').email('validation.email'),
  password: yup.string().required('validation.required'),
  remember: yup.boolean().nullable(),
});

const registerEnabled = APP_IS_REGISTER_ENABLED;

const Login: FC = () => {
  const dispatch = setGlobalState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLogging, setIsLogging] = useState(false);

  // Utworzenie formularza i wstawienie przykładowych danych jeśli dev
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginInterface>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: process.env.NODE_ENV === 'development' ? 'superadmin@mail.com' : '',
      password: process.env.NODE_ENV === 'development' ? 'root12' : '',
      remember: false,
    },
  });

  const onSubmit = async (formData: LoginInterface) => {
    setIsLogging(true);

    try {
      const res = await AuthService.login(formData);
      const data = res.data;

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

      console.log({ currentUser: currentUser });

      // Witaj, {{name}}!
      dispatch(
        toastActions.showToast({ severity: 'success', summary: 'Sukces', detail: t('login.messages.loginSuccess', { name: `${currentUser.name}` }) })
      );
      // Ustawienie zalogowania
      dispatch(authActions.login(currentUser));
      // Przekierowanie na dashboard
      navigate('/dashboard/home', { replace: true });
    } catch {
      // Błędny login lub hasło.
      dispatch(toastActions.showToast({ severity: 'error', summary: 'Error', detail: t('login.messages.wrongEmailOrPassword') }));
    }

    setIsLogging(false);
  };

  return (
    <>
      <div className="flex flex-column align-items-center justify-content-center">
        <div className="row light-blur-bg rounded-3 p-3 pb-4">
          <div className="col-12">
            <h3 className="mt-4 mb-4 text-center">{t('appName')}</h3>
          </div>
          <div className="col-12">
            <form className="" onSubmit={handleSubmit(onSubmit)}>
              <input type="hidden" name="remember" defaultValue="true" />

              <div>
                <div className="field p-fluid">
                  <label htmlFor="email-address">{t('login.email')}</label>
                  <InputText id="email" {...register('email')} className={errors.email ? 'p-invalid' : ''} placeholder={t('login.email')} />
                  {errors.email && <small className="p-error">{t(errors.email.message || '')}</small>}
                </div>
                <div className="field p-fluid mt-3">
                  <label htmlFor="password">{t('login.password')}</label>
                  <Password
                    id="password"
                    value={watch('password')} // Ustawienie wartości z formularza
                    onChange={(e) => setValue('password', e.target.value)} // Ustawienie wartości w formularzu
                    feedback={false}
                    toggleMask
                    className={errors.password ? 'p-invalid' : ''}
                    placeholder={t('login.password')}
                  />
                  {errors.password && <small className="p-error">{t(errors.password.message || '')}</small>}
                </div>
              </div>

              <div className="mt-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center mb-2">
                  <Checkbox
                    inputId="remember"
                    checked={!!watch('remember')} // Ensure the value is always a boolean
                    onChange={(e) => setValue('remember', e.checked)} // Update the form value
                  />
                  <label htmlFor="remember" className="ms-2">
                    {t('login.rememberMe')}
                  </label>
                </div>
                <div>
                  <Link to="/forgot-password" className="link-secondary link-underline-opacity-0">
                    {t('login.forgotPassword')}
                  </Link>
                </div>
              </div>

              <div className="mt-2 text-center">
                <Button severity="success" className="w-100 custom-button" disabled={isLogging}>
                  <PrimeButtonLabel text={t('login.logIn')} loader={isLogging} />
                </Button>
              </div>
            </form>

            {registerEnabled && (
              <div className="mt-2 text-center">
                <Link to="/register">
                  <Button label={t('login.registration')} severity="secondary" className="w-100" />
                </Link>
              </div>
            )}
          </div>
          <div className="col-12 mt-3 text-center">
            <small>{APP_VERSION}</small>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
