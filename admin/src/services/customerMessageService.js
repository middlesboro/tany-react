import { authFetch } from '../utils/authFetch';

const API_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_API_URL}/admin/customer-messages`;

export const getCustomerMessages = async (page = 0, sort = 'createDate,desc', size = 20) => {
  const response = await authFetch(`${API_URL}?page=${page}&size=${size}&sort=${sort}`);
  return response.json();
};
