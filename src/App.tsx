import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from './app/layout/public/PublicLayout';
import { FullScreenLoader } from './app/components/FullScreenLoader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './app/views/public/auth/Login';
import ForgotPassword from './app/views/public/auth/ForgotPassword';
import ResetPassword from './app/views/public/auth/ResetPassword';
// import Register from './app/views/public/auth/Register';
import { APP_VERSION, FEATURE_FLAG } from './envrionment';
import { CoreWrapper } from './app/core/CoreWrapper';
import { PrimeReactProvider } from 'primereact/api';

import './assets/layout/themes/lara/lara-light/indigo/theme.scss';
import './App.scss';

console.log({ APP_VERSION: APP_VERSION });
console.log({ FEATURE_FLAG: FEATURE_FLAG });

// const registerEnabled = process.env.REACT_APP_IS_REGISTER_ENABLED ?? false;
const queryClient = new QueryClient();

function App() {

  const value = {
    ripple: true,
  };

  return (
    <>
      <PrimeReactProvider value={value}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <CoreWrapper>
              <Suspense fallback={<FullScreenLoader />}>
                <Routes>
                  <Route path="/" element={<PublicLayout />}>
                    {/* Domyślne przekierowanie */}
                    <Route index element={<Navigate to="/dashboard/home" />} />

                    {/* Jeśli nie zalogowany */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    {/* {registerEnabled && (<Route path="/register" element={<Register />}/>)} */}
                  </Route>
                </Routes>
              </Suspense>
            </CoreWrapper>
          </BrowserRouter>
        </QueryClientProvider>
      </PrimeReactProvider>
    </>
  );
}

export default App;
