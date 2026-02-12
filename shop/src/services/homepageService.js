import { authFetch } from '../utils/authFetch';

const API_URL = `${import.meta.env.VITE_API_URL}/homepage-grids`;

export const getHomepageGrids = async () => {
  const response = await authFetch(API_URL);
  return response.json();
};
