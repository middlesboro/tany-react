import { authFetch } from '../utils/authFetch';

const API_ISKLAD_URL = `${import.meta.env.VITE_API_URL}/admin/isklad`;

export const getInventoryDifferences = async () => {
  const response = await authFetch(`${API_ISKLAD_URL}/inventory-differences`);
  return response.json();
};
