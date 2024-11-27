/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { APP_API_URL } from './../../../envrionment';

const resourceUrl = `${APP_API_URL}/user`;

// ---------------------------------------------------------------------------

/**
 * Pobranie danych dla tabelki według filtrów.
 * @param params
 */
const query = (params: any) => {
  return axios.get(`${resourceUrl}`, {
    params,
  });
};

/**
 * Pobranie wszystkich danych, które sa usunięte na soft delete.
 */
const queryDeleted = (params: any) => {
  return axios.get(`${resourceUrl}/deleted`, {
    params,
  });
};

/**
 * Pobranie wszystkich danych.
 */
const getAll = () => {
  return axios.get(`${resourceUrl}/get-all`);
};

/**
 * Pobranie danych po konkretnym ID.
 * @param id
 */
const getById = (id: any) => {
  return axios.get(`${resourceUrl}/${id}`);
};

/**
 * Utworzenie.
 * @param data
 */
const create = (data: any) => {
  return axios.post(`${resourceUrl}`, data);
};

/**
 * Aktualizacja.
 * @param data
 */
const update = (data: any) => {
  return axios.patch(`${resourceUrl}`, data);
};

// ---------------------------------------------------------------------------

/**
 * Usunięcie.
 * @param id
 */
const remove = (id: number) => {
  return axios.delete(`${resourceUrl}/${id}`);
};

/**
 * Przywrócenie.
 * @param id
 */
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
