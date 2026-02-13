import { authFetch } from '../utils/authFetch';

const API_ADMIN_URL = `${import.meta.env.VITE_API_URL}/admin/blogs`;

export const getBlogs = async (page = 0, sort = 'title,asc', size = 20) => {
  const response = await authFetch(`${API_ADMIN_URL}?page=${page}&size=${size}&sort=${sort}`);
  return response.json();
};

export const getBlog = async (id) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`);
  return response.json();
};

export const createBlog = async (blog) => {
  const response = await authFetch(API_ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blog),
  });
  return response.json();
};

export const updateBlog = async (id, blog) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blog),
  });
  return response.json();
};

export const deleteBlog = async (id) => {
  await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'DELETE',
  });
};

export const uploadBlogImage = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await authFetch(`${API_ADMIN_URL}/${id}/image`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
};

export const deleteBlogImage = async (id) => {
  await authFetch(`${API_ADMIN_URL}/${id}/image`, {
    method: 'DELETE',
  });
};
