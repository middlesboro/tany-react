import { authFetch } from '../utils/authFetch';

const API_ADMIN_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_API_URL}/admin/customer-emails`;

export const getCustomerEmails = async (page = 0, sort = 'email,asc', size = 20) => {
  const response = await authFetch(`${API_ADMIN_URL}?page=${page}&size=${size}&sort=${sort}`);
  return response.json();
};

export const getCustomerEmail = async (id) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`);
  return response.json();
};

export const createCustomerEmail = async (customerEmail) => {
  const response = await authFetch(API_ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerEmail),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create customer email');
  }
  return response.json();
};

export const updateCustomerEmail = async (id, customerEmail) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerEmail),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update customer email');
  }
  return response.json();
};

export const deleteCustomerEmail = async (id) => {
  await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'DELETE',
  });
};
