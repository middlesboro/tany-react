import { authFetch } from '../utils/authFetch';

const API_ADMIN_URL = `${process.env.REACT_APP_API_URL}/admin/products`;

export const getAdminProducts = async (page = 0, sort = 'title,asc', size = 20) => {
  const response = await authFetch(`${API_ADMIN_URL}?page=${page}&size=${size}&sort=${sort}`);
  return response.json();
};

export const getProduct = async (id) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`);
  return response.json();
};

export const createProduct = async (product) => {
  const response = await authFetch(API_ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  return response.json();
};

export const updateProduct = async (id, product) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  return response.json();
};

export const deleteProduct = async (id) => {
  await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'DELETE',
  });
};

export const uploadProductImages = async (id, files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  const response = await authFetch(`${API_ADMIN_URL}/${id}/images`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload images');
  }
};

export const deleteProductImage = async (id, imageUrl) => {
  await authFetch(`${API_ADMIN_URL}/${id}/images?url=${encodeURIComponent(imageUrl)}`, {
    method: 'DELETE',
  });
};
