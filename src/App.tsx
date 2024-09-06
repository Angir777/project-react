import React, { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { FullScreenLoader } from './app/components/FullScreenLoader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APP_VERSION, APP_IS_REGISTER_ENABLED } from './envrionment';
import { CoreAppWrapper } from './app/core/CoreAppWrapper';
import { PrimeReactProvider } from 'primereact/api';
import { PublicLayout } from './app/layout/public/PublicLayout';
import { ErrorLayout } from './app/layout/error/ErrorLayout';
import Login from './app/views/public/auth/Login';
import ForgotPassword from './app/views/public/auth/ForgotPassword';
import ResetPassword from './app/views/public/auth/ResetPassword';
import Register from './app/views/public/auth/Register';
import Page404 from './app/views/error/Page404';
import './assets/layout/themes/lara/lara-light/indigo/theme.scss';
import './App.scss';

console.log("APP version: " + APP_VERSION);

// Dashboard musi być jako lazy load bo inaczej nie ładuje currentUser z local storage przy refresh'u
const DashboardRouting = React.lazy(() => import('./app/views/dashboard/DashboardRouting'));

const registerEnabled = APP_IS_REGISTER_ENABLED;
const queryClient = new QueryClient();

function App() {
  // Ustawienia Prime'a
  const value = {
    ripple: true,
  };

  return (
    <>
      <PrimeReactProvider value={value}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <CoreAppWrapper>
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
