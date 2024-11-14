/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { APP_API_URL } from './../../../envrionment';

const resourceUrl = `${APP_API_URL}/user`;

// ---------------------------------------------------------------------------

const query = (params: any) => {
  return axios.get(`${resourceUrl}`, {
    params,
  });
};

const queryDeleted = (params: any) => {
  return axios.get(`${resourceUrl}/deleted`, {
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

// ---------------------------------------------------------------------------

const remove = (id: number) => {
  return axios.delete(`${resourceUrl}/${id}`);
};

const restore = (id: number) => {
  return axios.post(`${resourceUrl}/${id}/restore`);
};

// ---------------------------------------------------------------------------

const UserService = {
  query,
  queryDeleted,
  getAll,
  getById,
  create,
  update,
  remove,
  restore,
};
export default UserService;
