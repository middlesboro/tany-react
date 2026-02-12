import { authFetch } from '../utils/authFetch';

const API_ADMIN_URL = `${import.meta.env.VITE_API_URL}/admin/wishlists`;

export const getAdminWishlists = async (page = 0, size = 20, sort = 'id,desc') => {
  const params = new URLSearchParams({
    page,
    size,
    sort,
  });

  const response = await authFetch(`${API_ADMIN_URL}?${params.toString()}`);
  return response.json();
};

export const deleteWishlist = async (id) => {
  await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'DELETE',
  });
};
