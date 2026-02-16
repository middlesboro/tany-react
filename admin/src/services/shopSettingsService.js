import { authFetch } from '../utils/authFetch';

const API_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_API_URL}/admin/shop-settings`;

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
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update shop settings');
  }
  return response.json();
};
