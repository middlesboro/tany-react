import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/customer`;

export const getCustomerContext = async (cartId) => {
  let url = `${API_URL}/context`;
  if (cartId) {
    url += `?cartId=${cartId}`;
  }
  const response = await authFetch(url);
  if (!response.ok) {
     throw new Error('Failed to fetch customer context');
  }
  return response.json();
};
