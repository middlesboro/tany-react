import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/pages`;

export const getPageBySlug = async (slug) => {
  const response = await authFetch(`${API_URL}/${slug}`);
  if (response.status === 404) {
    return null;
  }
  return response.json();
};
