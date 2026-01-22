import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/admin/categories`;

export const getCategories = async (page = 0, sort = 'title,asc', size = 20, filter = {}) => {
  const params = new URLSearchParams({
    page,
    size,
    sort,
  });

  if (filter.query) params.append('query', filter.query);

  const response = await authFetch(`${API_URL}?${params.toString()}`);
  return response.json();
};

export const getCategory = async (id) => {
  const response = await authFetch(`${API_URL}/${id}`);
  return response.json();
};

export const createCategory = async (category) => {
  const response = await authFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
  return response.json();
};

export const updateCategory = async (id, category) => {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
  return response.json();
};

export const deleteCategory = async (id) => {
  await authFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
};
