import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/homepage-grids`;

export const getHomepageGrids = async () => {
  const response = await authFetch(API_URL);
  return response.json();
};
