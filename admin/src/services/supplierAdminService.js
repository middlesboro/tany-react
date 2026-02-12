import { authFetch } from '../utils/authFetch';

const API_ADMIN_URL = `${import.meta.env.VITE_API_URL}/admin/suppliers`;

export const getSuppliers = async (page = 0, sort = 'name,asc', size = 20) => {
  const response = await authFetch(`${API_ADMIN_URL}?page=${page}&size=${size}&sort=${sort}`);
  return response.json();
};

export const getSupplier = async (id) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`);
  return response.json();
};

export const createSupplier = async (supplier) => {
  const response = await authFetch(API_ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(supplier),
  });
  return response.json();
};

export const updateSupplier = async (id, supplier) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(supplier),
  });
  return response.json();
};

export const deleteSupplier = async (id) => {
  await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'DELETE',
  });
};
