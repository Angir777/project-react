// import { AxiosInterceptors } from './AxiosInterceptors';
// import { useEffect } from 'react';
// import { configActions } from '../store/redux/config';
// import { authActions } from '../store/redux/auth';
// import { Credentials } from '../shared/models';
import { useTranslation } from 'react-i18next';
// import { DateTime } from 'luxon';
// import { useAppDispatch, useAppSelector } from '../store/redux/hooks/reduxHooks';
// import { APP_STORAGE_KEY } from '../../envrionment';

// Czy pierwsze odpalenie aplikacji
let isInit = true;

export const CoreWrapper = ({ children }: any) => {
  // const dispatch = useAppDispatch();
  // const currentLanguage = useAppSelector((state: any) => state.config.currentLanguage);
  const { i18n } = useTranslation();

  if (isInit) {
    isInit = false;
    console.log({
      "tutaj":"tutaj",
    });
  }

  // Wczytanie usera z localstorage przy starcie aplikacji
  // useEffect(() => {
  //   const bootstrapAsync = () => {
  //     let currentUser: Credentials | null = null;

  //     try {
  //       const storageData = localStorage.getItem(`${APP_STORAGE_KEY}-currentUser`);
  //       if (storageData != null) {
  //         currentUser = JSON.parse(storageData);
  //       }
  //     } catch (e) {
  //       return;
  //     }

  //     if (currentUser == null) {
  //       return;
  //     } else {
  //       // Sprawdzenie, czy token jest ok na podstawie daty ważności tokenu
  //       const tokenExpireDate = DateTime.fromISO(currentUser.token.expiresAt);
  //       const now = DateTime.now();
  //       if (now > tokenExpireDate) {
  //         return;
  //       }
  //     }

  //     // Ustawienie token
  //     dispatch(authActions.restoreUser(currentUser));
  //   };

  //   bootstrapAsync();
  // }, []);

  // Zmiana języka w aplikacji
  // useEffect(() => {
  //   const changeLanguage = async (lang: any) => {
  //     await i18n.changeLanguage(lang);
  //   };

  //   if (isInit) {
  //     isInit = false;
  //     dispatch(configActions.loadCurrentLanguageFromLocalStore());
  //   } else {
  //     changeLanguage(currentLanguage).then((r) => {
  //       console.log('Language changed: ' + currentLanguage);
  //     });
  //   }
  // }, [currentLanguage, dispatch, i18n]);

  return (
    <div>
      <>{children}</>
    </div>
    // <AxiosInterceptors>
    //   <>{children}</>
    // </AxiosInterceptors>
  );
};
