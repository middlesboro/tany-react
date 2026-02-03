import { authFetch } from '../utils/authFetch';

const API_ISKLAD_URL = `${process.env.REACT_APP_API_URL}/admin/isklad`;

export const getInventoryDifferences = async () => {
  const response = await authFetch(`${API_ISKLAD_URL}/inventory-differences`);
  return response.json();
};
