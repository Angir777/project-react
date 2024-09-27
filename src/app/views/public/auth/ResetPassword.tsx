import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { FinishResetPasswordInterface } from '../../../interfaces/finish-reset-password.interface';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import AuthService from '../../../services/auth/auth.service';
import { setGlobalState } from '../../../core/redux/hooks/reduxHooks';
import { toastActions } from '../../../core/redux/toast';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { PrimeButtonLabel } from '../../../components/PrimeButtonLabel';

const schema = yup.object().shape({
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
});

const ResetPassword: FC = () => {
  const dispatch = setGlobalState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<FinishResetPasswordInterface>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (formData: FinishResetPasswordInterface) => {
    setIsResettingPassword(true);

    try {
      await AuthService.resetPassword({
        ...formData,
        token: token,
      });

      dispatch(
        toastActions.showToast({
          severity: 'success',
          summary: t('toast.summary.success'),
          detail: t('resetPassword.messages.success.passwordResetSuccess'),
        })
      );

      navigate('/login', { replace: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data?.error === 'TOKEN_INVALID') {
        // Nie poprawny kod potwierdzenia!
        dispatch(
          toastActions.showToast({
            severity: 'error',
            summary: t('toast.summary.error'),
            detail: t('resetPassword.messages.errors.tokenInvalid'),
          })
        );
      } else {
        dispatch(
          toastActions.showToast({
            severity: 'error',
            summary: t('toast.summary.error'),
            detail: t('resetPassword.messages.errors.cantResetPassword'),
          })
        );
      }
    }

    // Zresetowanie formularza
    reset();

    setIsResettingPassword(false);
  };

  return (
    <>
      <div className="flex flex-column align-items-center justify-content-center">
        <div className="row light-blur-bg rounded-3 p-3 pb-4">
          <div className="col-12">
            <h3 className="mt-4 mb-4 text-center">{t('resetPassword.title')}</h3>
          </div>
          <div className="col-12">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="field p-fluid mt-3">
                  <label htmlFor="email-address">{t('resetPassword.form.email')}*</label>
                  <InputText
                    id="email"
                    {...register('email')}
                    className={`${errors.email ? 'p-invalid' : ''} p-inputtext-sm`}
                    placeholder={t('resetPassword.form.email')}
                  />
                  {errors.email && <small className="p-error">{t(errors.email.message || '')}</small>}
                </div>

                <div className="field p-fluid mt-3">
                  <label htmlFor="password">{t('resetPassword.form.password')}*</label>
                  <Password
                    id="password"
                    value={watch('password')}
                    onChange={(e) => setValue('password', e.target.value)}
                    feedback={false}
                    toggleMask
                    className={`${errors.password ? 'p-invalid' : ''} p-inputtext-sm`}
                    placeholder={t('resetPassword.form.password')}
                  />
                  {errors.password && <small className="p-error">{t(errors.password.message || '')}</small>}
                </div>

                <div className="field p-fluid mt-3">
                  <label htmlFor="password_confirmation">{t('resetPassword.form.passwordConfirmation')}*</label>
                  <Password
                    id="password_confirmation"
                    value={watch('password_confirmation')}
                    onChange={(e) => setValue('password_confirmation', e.target.value)}
                    feedback={false}
                    toggleMask
                    className={`${errors.password_confirmation ? 'p-invalid' : ''} p-inputtext-sm`}
                    placeholder={t('resetPassword.form.passwordConfirmation')}
                  />
                  {errors.password_confirmation && <small className="p-error">{t(errors.password_confirmation.message || '')}</small>}
                </div>
              </div>

              <div className="mt-4 text-center">
                <Button severity="success" className="w-100 custom-button" disabled={isResettingPassword}>
                  <PrimeButtonLabel text={t('resetPassword.buttons.resetPassword')} loader={isResettingPassword} />
                </Button>
              </div>
            </form>

            <div className="mt-1 text-center">
              <Link to="/login" className="link-secondary link-underline-opacity-0">
                {t('resetPassword.buttons.goBackToLogIn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
