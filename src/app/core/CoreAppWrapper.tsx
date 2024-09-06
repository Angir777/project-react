import { useTranslation } from 'react-i18next';
import { setGlobalState, getGlobalState } from './redux/hooks/reduxHooks';
import { Credentials } from '../models/auth/Auth';
import { PropsWithChildren, useEffect } from 'react';
import { DateTime } from 'luxon';
import { APP_STORAGE_KEY } from '../../envrionment';
import { authActions } from './redux/auth';
import { configActions } from './redux/config';
import { AxiosInterceptors } from './AxiosInterceptors';
import { RootState } from './redux';

// Czy pierwsze odpalenie aplikacji
let isInit = true;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CoreAppWrapper = ({ children }: PropsWithChildren<any>) => {
  const dispatch = setGlobalState();
  const currentLanguage = getGlobalState((state: RootState) => state.config.currentLanguage);
  const { i18n } = useTranslation();

  // Wczytanie usera z localstorage przy starcie aplikacji
  useEffect(() => {
    const bootstrapAsync = () => {
      let currentUser: Credentials | null = null;

      try {
        const storageData = localStorage.getItem(`${APP_STORAGE_KEY}-currentUser`);
        if (storageData != null) {
          currentUser = JSON.parse(storageData);
        }
      } catch {
        return;
      }

      if (currentUser == null) {
        return;
      } else {
        // Sprawdzenie, czy token jest ok na podstawie daty ważności tokenu
        const tokenExpireDate = DateTime.fromISO(currentUser.token.expiresAt);
        const now = DateTime.now();
        if (now > tokenExpireDate) {
          return;
        }
      }

      // Przywrócenie zalogowania usera z localstorage
      dispatch(authActions.restoreUser(currentUser));
    };

    bootstrapAsync();
  }, []);

  // Zmiana języka w aplikacji
  useEffect(() => {
    const changeLanguage = async (lang: string) => {
      await i18n.changeLanguage(lang);
    };

    if (isInit) {
      isInit = false;
      dispatch(configActions.loadCurrentLanguageFromLocalStore());
    } else {
      changeLanguage(currentLanguage).then(() => {
        console.log('Language changed: ' + currentLanguage);
      });
    }
  }, [currentLanguage, dispatch, i18n]);

  return (
    <AxiosInterceptors>
      <>{children}</>
    </AxiosInterceptors>
  );
};
