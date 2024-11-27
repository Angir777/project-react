/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { APP_API_URL } from './../../../envrionment';

const resourceUrl = `${APP_API_URL}/role`;

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

// ---------------------------------------------------------------------------

const RoleService = {
  query,
  getAll,
  getById,
  create,
  update,
  remove,
};
export default RoleService;
