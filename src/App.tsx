import React, { Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { FullScreenLoader } from './app/components/FullScreenLoader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APP_IS_REGISTER_ENABLED } from './envrionment';
import { CoreAppWrapper } from './app/core/CoreAppWrapper';
import { PrimeReactProvider } from 'primereact/api';
import { PublicLayout } from './app/layout/public/PublicLayout';
import { ErrorLayout } from './app/layout/error/ErrorLayout';
import { Toast } from 'primereact/toast';
import { setGlobalState } from './app/core/redux/hooks/reduxHooks';
import { useSelector } from 'react-redux';
import { RootState } from './app/core/redux';
import { toastActions } from './app/core/redux/toast';
import Login from './app/views/public/auth/Login';
import ForgotPassword from './app/views/public/auth/ForgotPassword';
import ResetPassword from './app/views/public/auth/ResetPassword';
import AccountConfirmation from './app/views/public/auth/AccountConfirmation';
import Register from './app/views/public/auth/Register';
import Page403 from './app/views/error/Page403';
import Page404 from './app/views/error/Page404';
import './App.scss';
import { motywActions } from './app/core/redux/motyw';

// Dashboard musi być jako lazy load bo inaczej nie ładuje currentUser z local storage przy refresh'u
const DashboardRouting = React.lazy(() => import('./app/views/dashboard/DashboardRouting'));

const registerEnabled = APP_IS_REGISTER_ENABLED;
const queryClient = new QueryClient();

function App() {
  const dispatch = setGlobalState();

  // Ustawienia Prime'a
  const value = {
    ripple: true,
  };

  // Wyświetlanie globalne toast
  const { severity, summary, detail, isVisible } = useSelector((state: RootState) => state.toast);
  const toastRef = useRef<Toast | null>(null);

  React.useEffect(() => {
    if (isVisible && toastRef.current) {
      toastRef.current.show({ severity, summary, detail });
      dispatch(toastActions.hideToast());
    }
  }, [isVisible, severity, summary, detail, dispatch]);

  // Pobranie aktualnego motywu
  const currentMotyw = useSelector((state: RootState) => state.motyw.currentMotyw);
  // Funkcja zmieniająca motyw
  const changeTheme = (theme: string) => {
    // Tworzymy nowy element <link> do motywu
    const themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.type = 'text/css';
    themeLink.href = `/assets/layout/themes/lara/lara-${theme}/indigo/theme.css`;
    themeLink.id = `theme-${theme}-css`;
    // Ustawimy nowy motyw i usuwamy poprzedni motyw (jeśli istnieje)
    if (theme == 'light') {
      // Dodajemy nowy motyw
      document.head.appendChild(themeLink);
      // Usuwamy stary motyw
      const existingLink = document.getElementById('theme-dark-css');
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    } else {
      // Dodajemy nowy motyw
      document.head.appendChild(themeLink);
      // Usuwamy stary motyw
      const existingLink = document.getElementById('theme-light-css');
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    }
  };
  // Inicjalizacja Redux motywu
  useEffect(() => {
    dispatch(motywActions.loadCurrentMotywFromLocalStore());
  }, [dispatch]);
  // Monitorujemy zmiany w Reduxie i zmieniamy motyw w czasie rzeczywistym
  useEffect(() => {
    changeTheme(currentMotyw);
  }, [currentMotyw]);

  return (
    <>
      <PrimeReactProvider value={value}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <CoreAppWrapper>
              <Toast ref={toastRef} />
              <Suspense fallback={<FullScreenLoader />}>
                <Routes>
                  <Route path="/" element={<PublicLayout />}>
                    {/* Domyślne przekierowanie */}
                    <Route index element={<Navigate to="/dashboard/home" />} />

                    {/* Jeśli nie zalogowany */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    {registerEnabled && (
                      <>
                        <Route path="/register" element={<Register />} />
                        <Route path="/account-confirmation/:code" element={<AccountConfirmation />} />
                      </>
                    )}
                  </Route>

                  <Route path={'/error/*'} element={<ErrorLayout />}>
                    <Route path="403" element={<Page403 />} />
                    <Route path="404" element={<Page404 />} />
                  </Route>

                  {/* Jeśli zalogowany */}
                  <Route
                    path="/dashboard/*"
                    element={
                      // Powtórzenie tutaj 'Suspense' skutkuje nie wyświetleniem przy ładowaniu backgroundu strony logowania
                      <Suspense fallback={<FullScreenLoader />}>
                        <DashboardRouting />
                      </Suspense>
                    }
                  />

                  <Route path="403" element={<Page403 />} />
                  <Route path="*" element={<Page404 />} />
                </Routes>
              </Suspense>
            </CoreAppWrapper>
          </BrowserRouter>
        </QueryClientProvider>
      </PrimeReactProvider>
    </>
  );
}

export default App;
