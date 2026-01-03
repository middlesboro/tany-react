import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/payments`;

export const getPaymentInfo = async (orderId) => {
  const response = await authFetch(`${API_URL}/info/${orderId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch payment info');
  }
  return response.json();
};
