import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/categories`;

export const getCategories = async () => {
  const response = await authFetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};
