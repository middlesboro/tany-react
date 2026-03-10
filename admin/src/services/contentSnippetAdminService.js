import { authFetch } from '../utils/authFetch';

const API_ADMIN_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_API_URL}/admin/content-snippets`;

export const getContentSnippets = async (page = 0, sort = 'name,asc', size = 20) => {
  const response = await authFetch(`${API_ADMIN_URL}?page=${page}&size=${size}&sort=${sort}`);
  return response.json();
};

export const getContentSnippet = async (id) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Content snippet not found');
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch content snippet');
  }
  return response.json();
};

export const createContentSnippet = async (contentSnippet) => {
  const response = await authFetch(API_ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contentSnippet),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create content snippet');
  }
  return response.json();
};

export const updateContentSnippet = async (id, contentSnippet) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contentSnippet),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update content snippet');
  }
  return response.json();
};

export const deleteContentSnippet = async (id) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete content snippet');
  }
};
