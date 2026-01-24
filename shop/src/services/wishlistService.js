import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/wishlist`;
// If the backend is running on 8080 and we proxy to it, we need to make sure the path is correct.
// Standard Spring setup usually keeps context root / or /api.
// Assuming the controller is mapped as requested in prompt.

export const addToWishlist = async (productId) => {
  const response = await authFetch(`${API_URL}/${productId}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to add to wishlist');
  }
};

export const removeFromWishlist = async (productId) => {
  const response = await authFetch(`${API_URL}/${productId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to remove from wishlist');
  }
};

export const getWishlist = async () => {
  const response = await authFetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch wishlist');
  }
  return response.json();
};
