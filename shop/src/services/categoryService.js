import { authFetch } from '../utils/authFetch';

const API_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_API_URL}/categories`;

let categoriesPromise = null;

export const getCategories = () => {
  if (!categoriesPromise) {
    categoriesPromise = authFetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          categoriesPromise = null;
        }
        return response.json();
      })
      .catch((error) => {
        categoriesPromise = null;
        throw error;
      });
  }
  return categoriesPromise;
};
