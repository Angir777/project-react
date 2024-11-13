/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { APP_API_URL } from './../../../envrionment';
import { prepareRequestParams } from '../../utils/request-params.utils';

const resourceUrl = `${APP_API_URL}/user`;

const query = (req: any) => {
  const params = prepareRequestParams(req);
  return axios.get(`${resourceUrl}`, {
    params,
  });
};

const getAll = () => {
  return axios.get(`${resourceUrl}/get-all`);
};

const getById = (id: any) => {
  return axios.get(`${resourceUrl}/${id}`);
};

const create = (data: any) => {
  return axios.post(`${resourceUrl}`, data);
};

const update = (data: any) => {
  return axios.post(`${resourceUrl}`, data, {
    params: {
      _method: 'PATCH',
    },
  });
};

const remove = (id: number) => {
  return axios.delete(`${resourceUrl}/${id}`);
};

const UserService = {
  query,
  getAll,
  getById,
  create,
  update,
  remove,
};
export default UserService;
