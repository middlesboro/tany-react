import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/payments`;

export const getPaymentInfo = async (orderId) => {
  const response = await authFetch(`${API_URL}/info/${orderId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch payment info');
  }
  return response.json();
};

export const verifyGlobalPayment = async (params) => {
  const response = await authFetch(`${API_URL}/global-payments-callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to verify global payment');
  }
  return response.json();
};
