import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/orders`;

export const createOrder = async (orderData) => {
  const response = await authFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
     throw new Error('Failed to create order');
  }
  return response.json();
};

export const getOrder = async (id) => {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
     throw new Error('Failed to fetch order');
  }
  return response.json();
};
