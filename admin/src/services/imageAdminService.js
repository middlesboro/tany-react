import { authFetch } from '../utils/authFetch';

const API_ADMIN_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_API_URL}/admin/images`;

export const uploadImage = async (file, type = 'PRODUCT') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await authFetch(`${API_ADMIN_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Failed to upload image');
  }

  // The endpoint returns the URL as a plain string
  return response.text();
};
