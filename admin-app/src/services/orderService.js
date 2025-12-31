import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/orders`;

export const getOrders = async (page = 0, sort = 'id,asc', size = 20) => {
  const response = await authFetch(`${API_URL}?page=${page}&size=${size}&sort=${sort}`);
  return response.json();
};

export const getOrder = async (id) => {
  const response = await authFetch(`${API_URL}/${id}`);
  return response.json();
};

export const createOrder = async (order) => {
  const response = await authFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });
  return response.json();
};

export const updateOrder = async (id, order) => {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });
  return response.json();
};

export const deleteOrder = async (id) => {
  await authFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
};
