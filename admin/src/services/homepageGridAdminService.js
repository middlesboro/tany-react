import { authFetch } from '../utils/authFetch';

const API_ADMIN_URL = `${import.meta.env.VITE_API_URL}/admin/homepage-grids`;

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
  return response.json();
};

export const deleteHomepageGrid = async (id) => {
  await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'DELETE',
  });
};
