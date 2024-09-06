import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { authActions } from './redux/auth';
import { setGlobalState, getGlobalState } from './redux/hooks/reduxHooks';
import { APP_STORAGE_KEY } from '../../envrionment';
import { PropsWithChildren } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AxiosInterceptors = ({ children }: PropsWithChildren<any>) => {
  const dispatch = setGlobalState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentLanguage = getGlobalState((state: any) => state.config.currentLanguage);
  const navigate = useNavigate();

  axios.interceptors.request.use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (config: any) => {
      let authHeader = null;
      const storageData = localStorage.getItem(`${APP_STORAGE_KEY}-currentUser`);
      if (storageData != null) {
        const currentUser = JSON.parse(storageData);
        authHeader = { Authorization: `Bearer ${currentUser.token.accessToken}` };
      }

      config.headers = {
        ...(authHeader ?? {}),
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'App-Language': currentLanguage,
        ...config.headers,
      };

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    async (res: AxiosResponse) => {
      return res;
    },
    async (error: AxiosError) => {
      if (error.response != null) {
        const status = error.response.status;

        if (error.response.config.url?.toString().includes('login')) {
          return Promise.reject(error);
        }

        if (status === 401 || status === 403) {
          // Clear from storage
          dispatch(authActions.logout());
          navigate('/login', { replace: true });
        }
      }

      return Promise.reject(error);
    }
  );

  return <>{children}</>;
};
