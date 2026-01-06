import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/payments`;

export const getPaymentInfo = async (orderId) => {
  const response = await authFetch(`${API_URL}/info/${orderId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch payment info');
  }
  return response.json();
};

export const getBesteronOrderId = async (transactionId) => {
  const response = await authFetch(`${API_URL}/besteron/order-id/${transactionId}`);
  if (!response.ok) {
    throw new Error('Failed to get order ID from transaction ID');
  }
  // The API might return the ID directly or in a JSON object.
  // We'll try to parse as JSON, if valid JSON, otherwise treat as text.
  const text = await response.text();
  try {
      const json = JSON.parse(text);
      // If it's an object with orderId, return it. If it's just a number/string in JSON, return it.
      if (typeof json === 'object' && json !== null && json.orderId) {
          return json.orderId;
      }
      return json;
  } catch (e) {
      return text;
  }
};

export const checkBesteronStatus = async (orderId) => {
  const response = await authFetch(`${API_URL}/besteron-status/${orderId}`);
  if (!response.ok) {
    throw new Error('Failed to check Besteron status');
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
