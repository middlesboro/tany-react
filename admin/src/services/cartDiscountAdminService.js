import { authFetch } from '../utils/authFetch';

const API_ADMIN_URL = `${process.env.REACT_APP_API_URL}/admin/cart-discounts`;

export const getCartDiscounts = async (page = 0, sort = 'title,asc', size = 20) => {
  const params = new URLSearchParams({
    page,
    size,
    sort,
  });

  const response = await authFetch(`${API_ADMIN_URL}?${params.toString()}`);
  return response.json();
};

export const getCartDiscount = async (id) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`);
  return response.json();
};

export const createCartDiscount = async (cartDiscount) => {
  const response = await authFetch(API_ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartDiscount),
  });
  return response.json();
};

export const updateCartDiscount = async (id, cartDiscount) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartDiscount),
  });
  return response.json();
};

export const deleteCartDiscount = async (id) => {
  await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'DELETE',
  });
};
