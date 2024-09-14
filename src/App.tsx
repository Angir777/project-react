import React, { Suspense, useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { FullScreenLoader } from './app/components/FullScreenLoader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APP_VERSION, APP_IS_REGISTER_ENABLED } from './envrionment';
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
import Register from './app/views/public/auth/Register';
import Page403 from './app/views/error/Page403';
import Page404 from './app/views/error/Page404';
import './assets/layout/themes/lara/lara-light/indigo/theme.scss';
import './App.scss';

console.log("APP version: " + APP_VERSION);

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
                    {registerEnabled && <Route path="/register" element={<Register />} />}
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
