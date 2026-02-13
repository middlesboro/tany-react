
import { authFetch } from '../utils/authFetch';

const API_URL = `${import.meta.env.VITE_API_URL}/blogs`;

export const getBlogs = async () => {
  const response = await authFetch(API_URL);
  if (!response.ok) {
      throw new Error('Failed to fetch blogs');
  }
  return response.json();
};

export const getBlogBySlug = async (slug) => {
  const response = await authFetch(`${API_URL}/slug/${slug}`);
  if (!response.ok) {
      if (response.status === 404) {
          return null;
      }
      throw new Error('Failed to fetch blog');
  }
  return response.json();
};

export const getBlog = async (id) => {
  const response = await authFetch(`${API_URL}/${id}`);
  if (!response.ok) {
      if (response.status === 404) {
          return null;
      }
      throw new Error('Failed to fetch blog');
  }
  return response.json();
};
