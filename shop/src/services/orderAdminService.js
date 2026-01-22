import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/admin/orders`;

export const getOrders = async (page = 0, sort = 'id,asc', size = 20, filter = {}) => {
  const params = new URLSearchParams({
    page,
    size,
    sort,
  });

  if (filter.id) params.append('id', filter.id);
  if (filter.status) params.append('status', filter.status);
  if (filter.priceFrom) params.append('priceFrom', filter.priceFrom);
  if (filter.priceTo) params.append('priceTo', filter.priceTo);
  if (filter.customerId) params.append('customerId', filter.customerId);

  const response = await authFetch(`${API_URL}?${params.toString()}`);
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

export const downloadInvoice = async (id) => {
  const response = await authFetch(`${API_URL}/${id}/invoice`);
  return response;
};
