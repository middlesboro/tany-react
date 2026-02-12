import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/admin/orders`;

export const getOrders = async (page = 0, sort = 'id,asc', size = 20, filter = {}) => {
  const params = new URLSearchParams({
    page,
    size,
    sort,
  });

  if (filter.orderIdentifier) params.append('orderIdentifier', filter.orderIdentifier);
  if (filter.status) params.append('status', filter.status);
  if (filter.priceFrom) params.append('priceFrom', filter.priceFrom);
  if (filter.priceTo) params.append('priceTo', filter.priceTo);
  if (filter.carrierId) params.append('carrierId', filter.carrierId);
  if (filter.paymentId) params.append('paymentId', filter.paymentId);

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

export const patchOrder = async (id, order) => {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: 'PATCH',
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

export const downloadCreditNote = async (id) => {
  const response = await authFetch(`${API_URL}/${id}/credit-note`);
  return response;
};
