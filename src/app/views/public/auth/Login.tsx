import { FC, useState } from 'react';
import * as yup from 'yup';
import { APP_IS_REGISTER_ENABLED } from '../../../../envrionment';
import { setGlobalState } from '../../../core/redux/hooks/reduxHooks';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import { Button } from 'primereact/button';
// import { Ripple } from 'primereact/ripple';
// import { toast } from 'react-toastify';
import { AuthUser } from '../../../models/auth/Auth';
import { LoginInterface } from '../../../interfaces/login.interface';
import AuthService from '../../../services/auth/auth.service';
import { authActions } from '../../../core/redux/auth';
import { classNames } from 'primereact/utils';
import { toastActions } from '../../../core/redux/toast';

const schema = yup.object().shape({
  email: yup.string().required('validation.required').email('validation.email'),
  password: yup.string().required({ msg: 'validation.required' }),
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
    formState: { errors },
  } = useForm<LoginInterface>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: process.env.NODE_ENV === 'development' ? 'superadmin@mail.com' : '',
      password: process.env.NODE_ENV === 'development' ? 'root12' : '',
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
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    {t('login.email')}
                  </label>
                  <input
                    id="email-address"
                    type="email"
                    autoComplete="email"
                    className={classNames(
                      errors.email ? 'border-red-400 bg-red-100 placeholder-red-400' : 'border-gray-300',
                      'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                    )}
                    placeholder={t('login.email')}
                    {...register('email')}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    {t('login.password')}
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className={classNames(
                      errors.password ? 'border-red-400 bg-red-100 placeholder-red-400' : 'border-gray-300',
                      'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                    )}
                    placeholder={t('login.password')}
                    {...register('password')}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    {...register('remember')}
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                    {t('login.rememberMe')}
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-normal text-sm text-gray-500 hover:text-gray-600">
                    {t('login.forgotPassword')}
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent
                          text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {!isLogging ? (
                      <p>HiOutlineLogin</p>
                    ) : (
                      // <HiOutlineLogin
                      //     className="h-5 w-5 text-indigo-100 group-hover:text-indigo-100"
                      //     aria-hidden="true"/>
                      <p>FiLoader</p>
                      // <FiLoader
                      //     className="h-5 w-5 text-indigo-100 group-hover:text-indigo-100 animate-spin"
                      //     aria-hidden="true"/>
                    )}
                  </span>
                  {t('login.logIn')}
                </button>
              </div>
            </form>
            {registerEnabled && (
              <div className="mt-8 text-center">
                <Link to="/register" className="font-normal text-sm text-gray-500 hover:text-gray-600">
                  {t('login.dontHaveAccount')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
