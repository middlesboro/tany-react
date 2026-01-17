import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/categories`;

export const getCategories = async (request = {}) => {
  const response = await authFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return response.json();
};
