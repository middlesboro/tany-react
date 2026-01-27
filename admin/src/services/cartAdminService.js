import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/admin/carts`;

export const getCarts = async (page = 0, sort = 'createDate,desc', size = 10, filter = {}) => {
  const params = new URLSearchParams({
    page,
    size,
    sort,
  });

  if (filter.cartId) params.append('cartId', filter.cartId);
  if (filter.orderIdentifier) params.append('orderIdentifier', filter.orderIdentifier);
  if (filter.customerName) params.append('customerName', filter.customerName);
  if (filter.dateFrom) params.append('dateFrom', filter.dateFrom);
  if (filter.dateTo) params.append('dateTo', filter.dateTo);

  const response = await authFetch(`${API_URL}?${params.toString()}`);
  return response.json();
};

export const getCartById = async (id) => {
  const response = await authFetch(`${API_URL}/${id}`);
  return response.json();
};
