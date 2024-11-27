/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { APP_API_URL } from './../../../envrionment';

const resourceUrl = `${APP_API_URL}/role`;

// ---------------------------------------------------------------------------

/**
 * Pobranie uprawnień
 */
const getPermissions = () => {
  return axios.get(`${resourceUrl}/get-permissions`);
};

// ---------------------------------------------------------------------------

const PermissionService = {
  getPermissions,
};
export default PermissionService;
