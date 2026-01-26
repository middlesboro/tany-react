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

export const getOrderConfirmation = async (id) => {
  const response = await authFetch(`${API_URL}/${id}/confirmation`, {
    method: 'GET',
  });

  if (!response.ok) {
     throw new Error('Failed to fetch order confirmation');
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

export const getOrders = async (page = 0, size = 10, sort = 'createDate,desc') => {
  const params = new URLSearchParams({
    page,
    size,
    sort
  });
  const response = await authFetch(`${API_URL}?${params.toString()}`, {
    method: 'GET',
  });

  if (!response.ok) {
     throw new Error('Failed to fetch orders');
  }
  return response.json();
};
