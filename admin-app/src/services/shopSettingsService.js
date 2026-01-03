import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/admin/shop-settings`;

export const getShopSettings = async () => {
  const response = await authFetch(API_URL);
  return response.json();
};

export const createShopSettings = async (data) => {
  const response = await authFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getShopSetting = async (id) => {
  const response = await authFetch(`${API_URL}/${id}`);
  return response.json();
};

export const updateShopSettings = async (id, data) => {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteShopSettings = async (id) => {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    return true;
  }
  return false;
};
