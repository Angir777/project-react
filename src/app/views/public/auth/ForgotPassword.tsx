import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { ForgotPasswordInterface } from '../../../interfaces/forgot-password.interface';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { PrimeButtonLabel } from '../../../components/PrimeButtonLabel';
import { Link } from 'react-router-dom';
import AuthService from '../../../services/auth/auth.service';
import { APP_RESET_PASSWORD_REDIRECT_URL } from './../../../../envrionment';
import { setGlobalState } from '../../../core/redux/hooks/reduxHooks';
import { toastActions } from '../../../core/redux/toast';

const schema = yup.object().shape({
  email: yup.string().required('validation.required').email('validation.email'),
});

const ForgotPassword: FC = () => {
  const dispatch = setGlobalState();
  const { t } = useTranslation();
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ForgotPasswordInterface>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: ForgotPasswordInterface) => {
    setIsSendingEmail(true);
    
    try {
      await AuthService.sendResetPasswordEmail({
        ...formData,
        'gatewayUrl': APP_RESET_PASSWORD_REDIRECT_URL,
      });

      // Wiadomość email z linkiem została wysłana pomyślnie.
      dispatch(
        toastActions.showToast({ 
          severity: 'success', 
          summary: t('toast.summary.success'), 
          detail: t('forgotPassword.messages.success.sendResetLinkSuccess') 
        })
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data?.error === 'USER_NOT_FOUND') {
        // Nie odnaleziono użytkownika o podanym adresie e-mail.
        dispatch(
          toastActions.showToast({
            severity: 'error',
            summary: t('toast.summary.error'),
            detail: t('forgotPassword.messages.errors.userNotFoundText'),
          })
        );
      } else if (error.response?.data?.error === 'TOKEN_EXISTS') {
        // Link do resetowania hasła został już wysłany na podany adres e-mail. Sprawdź swoją pocztę.
        dispatch(
          toastActions.showToast({
            severity: 'error',
            summary: t('toast.summary.error'),
            detail: t('forgotPassword.messages.errors.tokenExistsText'),
          })
        );
      } else {
        // Wystąpił problem podczas resetowania hasła. Spróbuj ponownie.
        dispatch(
          toastActions.showToast({
            severity: 'error',
            summary: t('toast.summary.error'),
            detail: t('forgotPassword.messages.errors.anotherErrorText'),
          })
        );
      }
    }

    // Zresetowanie formularza
    reset();

    setIsSendingEmail(false);
  };

  return (
    <>
      <div className="flex flex-column align-items-center justify-content-center">
        <div className="row light-blur-bg rounded-3 p-3 pb-4">
          <div className="col-12">
            <h3 className="mt-4 mb-4 text-center">{t('forgotPassword.title')}</h3>
          </div>
          <div className="col-12">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="field p-fluid">
                  <label htmlFor="email-address">{t('forgotPassword.form.email')}*</label>
                  <InputText
                    id="email"
                    {...register('email')}
                    className={`${errors.email ? 'p-invalid' : ''} p-inputtext-sm`}
                    placeholder={t('forgotPassword.form.email')}
                  />
                  {errors.email && <small className="p-error">{t(errors.email.message || '')}</small>}
                </div>
              </div>

              <div className="mt-4 text-center">
                <Button severity="success" className="w-100 custom-button" disabled={isSendingEmail}>
                  <PrimeButtonLabel text={t('forgotPassword.buttons.resetPassword')} loader={isSendingEmail} />
                </Button>
              </div>
            </form>

            <div className="mt-1 text-center">
              <Link to="/login" className="link-secondary link-underline-opacity-0">
                {t('forgotPassword.buttons.goBackToLogIn')}
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
