import { authFetch } from '../utils/authFetch';

const API_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_API_URL}/admin/product-labels`;

export const getProductLabels = async (page = 0, sort = 'title,asc', size = 20) => {
  const response = await authFetch(`${API_URL}?page=${page}&size=${size}&sort=${sort}`);
  return response.json();
};

export const getProductLabel = async (id) => {
  const response = await authFetch(`${API_URL}/${id}`);
  return response.json();
};

export const createProductLabel = async (productLabel) => {
  const response = await authFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productLabel),
  });
  return response.json();
};

export const updateProductLabel = async (id, productLabel) => {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productLabel),
  });
  return response.json();
};

export const deleteProductLabel = async (id) => {
  await authFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
};

export const getAllProductLabels = async () => {
    const response = await authFetch(`${API_URL}?page=0&size=1000&sort=title,asc`);
    const data = await response.json();
    return data.content;
};
