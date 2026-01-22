import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/admin/carts`;

export const getCarts = async () => {
  const response = await authFetch(API_URL);
  return response.json();
};

export const getCartById = async (id) => {
  const response = await authFetch(`${API_URL}/${id}`);
  return response.json();
};
