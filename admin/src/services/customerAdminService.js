import { authFetch } from '../utils/authFetch';

const API_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_API_URL}/admin/customers`;

export const getCustomers = async (filters = {}, page = 0, sort = 'lastname,asc', size = 20) => {
  const { firstname, lastname, email, phone } = filters;
  const params = new URLSearchParams({ page, size, sort });
  if (firstname) params.append('firstname', firstname);
  if (lastname) params.append('lastname', lastname);
  if (email) params.append('email', email);
  if (phone) params.append('phone', phone);
  const response = await authFetch(`${API_URL}?${params.toString()}`);
  return response.json();
};

export const getCustomer = async (id) => {
  const response = await authFetch(`${API_URL}/${id}`);
  return response.json();
};

export const createCustomer = async (customer) => {
  const response = await authFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create customer');
  }
  return response.json();
};

export const updateCustomer = async (id, customer) => {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update customer');
  }
  return response.json();
};

export const deleteCustomer = async (id) => {
  await authFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
};
