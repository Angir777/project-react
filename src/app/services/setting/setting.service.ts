import axios, { AxiosResponse } from 'axios';
import { APP_API_URL } from './../../../envrionment';
import { ChangePasswordInterface } from '../../interfaces/change-password.interface';

/**
 * Zmiana hasła przez użytkownika.
 *
 * @param {*} data
 * @return {*}  {Promise<AxiosResponse<ChangePasswordInterface>>}
 */
const changePassword = (data: ChangePasswordInterface): Promise<AxiosResponse<ChangePasswordInterface>> => {
  const body = {
    oldPassword: data.old_password,
    password: data.password,
    password_confirmation: data.password_confirmation,
  };
  return axios.patch<ChangePasswordInterface>(`${APP_API_URL}/account/change-password`, body);
};

/**
 * Usunięcie konta przez użytkownika.
 *
 * @return {*}  {Promise<AxiosResponse<any>>}
 */
const deleteAccount = () => {
  return axios.delete(`${APP_API_URL}/account/dalete-account`);
};

const SettingService = {
  changePassword,
  deleteAccount,
};
export default SettingService;
