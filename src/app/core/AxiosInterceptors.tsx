import {useAppDispatch, useAppSelector} from "../store/redux/hooks/reduxHooks";
import {authActions} from "../store/redux/auth";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import * as _ from 'lodash';

export const AxiosInterceptors = ({children}: any) => {
    const dispatch = useAppDispatch();
    const currentLanguage = useAppSelector(state => state.config.currentLanguage);
    const navigate = useNavigate();

    axios.interceptors.request.use(
        async config => {
            let authHeader = null;
            const storageData = localStorage.getItem(`${process.env.REACT_APP_STORAGE_KEY}-currentUser`);
            if (storageData != null) {
                const currentUser = JSON.parse(storageData);
                authHeader = {'Authorization': `Bearer ${currentUser.token.accessToken}`};
            }

            config.headers = {
                ...authHeader ?? {},
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'App-Language': currentLanguage,
                ...config.headers
            }

            return config;
        },
        error => {
            return Promise.reject(error)
        }
    );

    axios.interceptors.response.use(
        async (res) => {
            return res;
        },
        async (error) => {
            if (!_.isNil(error.response)) {
                const status = error.response.status;

                if (error.response.config.url.toString().includes('login')) {
                    return Promise.reject(error);
                }

                if (status === 401 || status === 403) {
                    // Clear from storage
                    dispatch(authActions.logout());
                    navigate('/login', {replace: true});
                }
            }

            return Promise.reject(error);
        }
    );

    return (
        <>{children}</>
    );
}
