import { useTranslation } from 'react-i18next';
import { setGlobalState, getGlobalState } from './redux/hooks/reduxHooks';
import { AuthUser } from '../models/auth/Auth';
import { PropsWithChildren, useEffect } from 'react';
import { APP_STORAGE_KEY } from '../../envrionment';
import { authActions } from './redux/auth';
import { AxiosInterceptors } from './AxiosInterceptors';
import { RootState } from './redux';
import { languageActions } from './redux/language';

// Czy pierwsze odpalenie aplikacji
let isInit = true;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CoreAppWrapper = ({ children }: PropsWithChildren<any>) => {
  const dispatch = setGlobalState();
  const currentLanguage = getGlobalState((state: RootState) => state.language.currentLanguage);
  const { i18n } = useTranslation();

  // Wczytanie usera z localstorage przy starcie aplikacji
  useEffect(() => {
    const bootstrapAsync = () => {
      let currentUser: AuthUser | null = null;

      try {
        const storageData = localStorage.getItem(`${APP_STORAGE_KEY}-currentUser`);
        if (storageData != null) {
          currentUser = JSON.parse(storageData);
        }
      } catch {
        return;
      }

      if (currentUser === null) {
        return;
      }

      // Przywrócenie zalogowania usera z localstorage
      dispatch(authActions.restoreUser(currentUser));
    };

    bootstrapAsync();
  }, []);

  // TODO: Zmiana języka w aplikacji
  useEffect(() => {
    const changeLanguage = async (lang: string) => {
      if (i18n.language !== lang) {
        await i18n.changeLanguage(lang);
      }
    };

    if (isInit) {
      isInit = false;
      dispatch(languageActions.loadCurrentLanguageFromLocalStore());
    } else {
      changeLanguage(currentLanguage).then(() => {
        // console.log('Language changed: ' + currentLanguage);
      });
    }
  }, [currentLanguage, dispatch, i18n]);

  return (
    <AxiosInterceptors>
      <>{children}</>
    </AxiosInterceptors>
  );
};
