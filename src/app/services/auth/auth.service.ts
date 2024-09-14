import axios, { AxiosResponse } from 'axios';
import { AuthUser } from '../../models/auth/Auth';
import { APP_API_URL } from './../../../envrionment';
import { LoginInterface } from '../../interfaces/login.interface';
import { RegisterInterface } from '../../interfaces/register.interface';
import { PasswordResetInterface } from '../../interfaces/password-reset.interface';
import { FinishResetPasswordInterface } from '../../interfaces/finish-reset-password.interface';

/**
 * Logowanie.
 *
 * @param {*} data
 * @return {*}  {Promise<AxiosResponse<AuthUser>>}
 */
const login = (data: LoginInterface): Promise<AxiosResponse<AuthUser>> => {
  return axios.post<AuthUser>(`${APP_API_URL}/auth/login`, data);
};

/**
 * Wylogowywanie.
 *
 * @return {*}  {Promise<AxiosResponse<AuthUser>>}
 */
const logout = (): Promise<AxiosResponse<AuthUser>> => {
  return axios.get<AuthUser>(`${APP_API_URL}/auth/logout`);
};

/**
 * Rejestracja.
 *
 * @param {*} data
 * @return {*}  {Promise<AxiosResponse<AuthUser>>}
 */
const register = (data: RegisterInterface): Promise<AxiosResponse<AuthUser>> => {
  return axios.post<AuthUser>(`${APP_API_URL}/auth/register`, data);
};

/**
 * Potwierdzenie konta.
 *
 * @param {string} code
 * @return {*}  {Promise<AxiosResponse<AuthUser>>}
 */
const confirmAccount = (code: string): Promise<AxiosResponse<AuthUser>> => {
  return axios.get<AuthUser>(`${APP_API_URL}/auth/confirm-account/${code}`);
};

/**
 * Prośba o zresetowanie hasła.
 *
 * @param {*} data
 * @return {*}  {Promise<AxiosResponse<string>>}
 */
const sendResetPasswordEmail = (data: PasswordResetInterface): Promise<AxiosResponse<string>> => {
  return axios.post<string>(`${APP_API_URL}/auth/send-reset-password-email`, data);
};

/**
 * Resetowanie hasła.
 *
 * @param {*} data
 * @return {*}  {Promise<AxiosResponse<AuthUser>>}
 */
const resetPassword = (data: FinishResetPasswordInterface): Promise<AxiosResponse<AuthUser>> => {
  return axios.post<AuthUser>(`${APP_API_URL}/auth/reset-password`, data);
};

const AuthService = {
  login,
  logout,
  register,
  confirmAccount,
  sendResetPasswordEmail,
  resetPassword,
};
export default AuthService;
