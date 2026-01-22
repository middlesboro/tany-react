import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/customer`;

export const getCustomerContext = async (cartId) => {
  let url = `${API_URL}/context`;
  if (cartId) {
    url += `?cartId=${cartId}`;
  }
  const response = await authFetch(url);
  if (!response.ok) {
     throw new Error('Failed to fetch customer context');
  }
  return response.json();
};

export const getCustomer = async () => {
    const response = await authFetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch customer');
    }
    return response.json();
};

export const updateCustomer = async (customer) => {
    const response = await authFetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
    });
    if (!response.ok) {
        throw new Error('Failed to update customer');
    }
    return response.json();
};
