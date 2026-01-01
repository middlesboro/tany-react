import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/carts`;

export const addToCart = async (cartId, productId, quantity) => {
  const body = { productId, quantity };
  if (cartId) {
    body.cartId = cartId;
  }

  const response = await authFetch(API_URL, {
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
