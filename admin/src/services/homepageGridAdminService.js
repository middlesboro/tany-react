import { authFetch } from '../utils/authFetch';

const API_ADMIN_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_API_URL}/admin/homepage-grids`;

export const getHomepageGrids = async (page = 0, sort = 'title,asc', size = 20) => {
  const response = await authFetch(`${API_ADMIN_URL}?page=${page}&size=${size}&sort=${sort}`);
  return response.json();
};

export const getHomepageGrid = async (id) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`);
  return response.json();
};

export const createHomepageGrid = async (homepageGrid) => {
  const response = await authFetch(API_ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(homepageGrid),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create homepage grid');
  }
  return response.json();
};

export const updateHomepageGridOrder = async (id, order) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ order }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update homepage grid order');
  }
  return response.json();
};

export const updateHomepageGrid = async (id, homepageGrid) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(homepageGrid),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update homepage grid');
  }
  return response.json();
};

export const deleteHomepageGrid = async (id) => {
  await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'DELETE',
  });
};
