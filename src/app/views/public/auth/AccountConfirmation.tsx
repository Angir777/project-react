import { FC, useEffect, useRef, useState } from 'react';
import { getGlobalState, setGlobalState } from '../../../core/redux/hooks/reduxHooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthService from '../../../services/auth/auth.service';
import { toastActions } from '../../../core/redux/toast';

const AccountConfirmation: FC = () => {
  const dispatch = setGlobalState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { code } = useParams(); // Pobranie parametru z url'a
  const currentUser = getGlobalState((state) => state.auth.currentUser); // Jeśli użytkownik jest zalogowany to kierujemy go na dashboard

  const hasExecuted = useRef(false); // Zabezpieczenie przed podwójnym wywołaniem

  useEffect(() => {
    const confirmAccount = async () => {
      
      if (hasExecuted.current) return;
      hasExecuted.current = true; // Ustawiamy flagę na true po pierwszym wykonaniu

      if (currentUser) {
        // Jeśli użytkownik jest zalogowany, przekieruj na dashboard
        navigate('/dashboard/home', { replace: true });
        return;
      }

      if (code) {
        try {
          // Wywołaj API do potwierdzenia konta
          await AuthService.confirmAccount(code);

          // Twoje konto zostało potwierdzone! Zaloguj się i w pełni korzystaj z serwisu!
          dispatch(
            toastActions.showToast({
              severity: 'success',
              summary: 'Sukces',
              detail: t('accountConfirmation.messages.success.accountConfirmationSuccessText'),
            })
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error.response?.data?.error === 'CODE_INVALID') {
            // Nie poprawny kod potwierdzenia!
            dispatch(
              toastActions.showToast({
                severity: 'error',
                summary: 'Error',
                detail: t('accountConfirmation.messages.errors.codeInvalidText'),
              })
            );
          } else if (error.response?.data?.error === 'ALREADY_CONFIRMED') {
            // Konto zostało już potwierdzone!
            dispatch(
              toastActions.showToast({
                severity: 'error',
                summary: 'Error',
                detail: t('accountConfirmation.messages.errors.alreadyConfirmedText'),
              })
            );
          } else {
            // Wystąpił problem z potwierdzeniem konta. Spróbuj ponownie.
            dispatch(
              toastActions.showToast({
                severity: 'error',
                summary: 'Error',
                detail: t('accountConfirmation.messages.errors.anotherErrorText'),
              })
            );
          }
        } finally {
          // Ustawienie stanu ładowania na false
          setIsLoading(false);
          // Przekierowanie na stronę logowania lub dashboard po sukcesie
          navigate('/login', { replace: true });
        }
      }
    };

    confirmAccount();
    
  }, [code, currentUser, dispatch, navigate, t]);

  if (isLoading) {
    return <div>{t('accountConfirmation.loading')}</div>;
  }

  return <div></div>;
};

export default AccountConfirmation;
