import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/cart`;

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
     throw new Error('Failed to add to cart');
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
