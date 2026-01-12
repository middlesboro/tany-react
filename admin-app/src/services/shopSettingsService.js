import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/admin/shop-settings`;

export const getShopSettings = async () => {
  const response = await authFetch(API_URL);
  return response.json();
};

export const updateShopSettings = async (data) => {
  const response = await authFetch(API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
