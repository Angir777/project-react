import { Suspense } from 'react'
import './App.css'

import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from './app/views/public/auth/Login/Login';
import { PublicLayout } from './app/layout/public/PublicLayout';
import { FullScreenLoader } from './app/components/FullScreenLoader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
          <BrowserRouter>
              {/* <CoreWrapper> */}
                  <Suspense fallback={<FullScreenLoader/>}>
                      <Routes>
                          <Route path="/" element={<PublicLayout/>}>
                              {/* Domyślne przekierowanie */}
                              <Route index element={<Navigate to="/dashboard/home"/>}/>

                              {/* Jeśli nie zalogowany */}
                              <Route path="/login" element={<Login/>}/>
                          </Route>
                      </Routes>
                  </Suspense>
              {/* </CoreWrapper> */}
          </BrowserRouter>
      </QueryClientProvider>
    </>
  )
}

export default App
