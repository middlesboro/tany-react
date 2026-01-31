import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/customer`;

export const getCustomerContext = async (cartId) => {
  let url = `${API_URL}/context`;
  if (cartId) {
    url += `?cartId=${cartId}`;
  }
  const response = await authFetch(url);

  if (response.status === 404 && cartId) {
    const error = new Error('Cart not found');
    error.status = 404;
    throw error;
  }

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

export const createEmailNotification = async (notification) => {
    const response = await authFetch(`${process.env.REACT_APP_API_URL}/customer/email-notification`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
    });
    if (!response.ok) {
        let errorMessage = 'Failed to create email notification';
        try {
            const errorData = await response.json();
            if (errorData.message) errorMessage = errorData.message;
        } catch (e) { }
        throw new Error(errorMessage);
    }
    try {
        return await response.json();
    } catch (e) {
        return true;
    }
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
