import { authFetch } from '../utils/authFetch';

const API_ADMIN_URL = `${import.meta.env.VITE_API_URL}/admin/payments`;

export const getPayments = async (page = 0, sort = 'name,asc', size = 20) => {
  const response = await authFetch(`${API_ADMIN_URL}?page=${page}&size=${size}&sort=${sort}`);
  return response.json();
};

export const getPayment = async (id) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`);
  return response.json();
};

export const createPayment = async (payment) => {
  const response = await authFetch(API_ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payment),
  });
  return response.json();
};

export const updatePayment = async (id, payment) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payment),
  });
  return response.json();
};

export const deletePayment = async (id) => {
  await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'DELETE',
  });
};

export const uploadPaymentImage = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await authFetch(`${API_ADMIN_URL}/${id}/image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  return response.json();
};

export const deletePaymentImage = async (id) => {
  await authFetch(`${API_ADMIN_URL}/${id}/image`, {
    method: 'DELETE',
  });
};
