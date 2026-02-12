import { authFetch } from '../utils/authFetch';

const API_URL = `${import.meta.env.VITE_API_URL}/cart`;

export const addToCart = async (cartId, productId, quantity) => {
  let url = `${API_URL}/items`;
  const body = { productId, quantity };
  if (cartId) {
    body.cartId = cartId;
  }

  const response = await authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
     const errorData = await response.json().catch(() => ({}));
     const error = new Error(errorData.message || 'Failed to add to cart');
     error.status = response.status;
     throw error;
  }
  return response.json();
};

export const removeFromCart = async (cartId, productId) => {
  let url = `${API_URL}/items`;
  const body = { productId, cartId };

  const response = await authFetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
     throw new Error('Failed to remove from cart');
  }
  return response.json();
};

export const updateCart = async (cartData) => {
  const response = await authFetch(API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartData),
  });

  if (!response.ok) {
    throw new Error('Failed to update cart');
  }
  return response.json();
};

export const addDiscount = async (cartId, code) => {
  const url = `${API_URL}/${cartId}/discount?code=${encodeURIComponent(code)}`;
  const response = await authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Failed to add discount');
    error.status = response.status;
    throw error;
  }
  return response.json();
};

export const removeDiscount = async (cartId, code) => {
  const url = `${API_URL}/${cartId}/discount?code=${encodeURIComponent(code)}`;
  const response = await authFetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to remove discount');
  }
  return response.json();
};
