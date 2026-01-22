import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/reviews`;

export const getReviewsByProduct = async (productId, page = 0, size = 10) => {
  const response = await authFetch(`${API_URL}/product/${productId}?page=${page}&size=${size}&sort=createDate,desc`);
  return response.json();
};

export const createReview = async (reviewData) => {
  const response = await authFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  if (!response.ok) {
    throw new Error('Failed to create review');
  }
};
