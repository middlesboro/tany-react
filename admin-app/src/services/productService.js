import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/products`;

export const getProducts = async (page = 0, sort = 'title,asc', size = 20) => {
  const response = await authFetch(`${API_URL}?page=${page}&size=${size}&sort=${sort}`);
  return response.json();
};

export const getProduct = async (id) => {
  const response = await authFetch(`${API_URL}/${id}`);
  return response.json();
};

export const getProductsByCategory = async (categoryId, page = 0, sort = 'title,asc', size = 20) => {
  const response = await authFetch(`${API_URL}/category/${categoryId}?page=${page}&size=${size}&sort=${sort}`);
  return response.json();
};

export const searchProducts = async (query) => {
  const response = await authFetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  return response.json();
};

export const searchProductsByCategory = async (categoryId, filterRequest, page = 0, sort = 'title,asc', size = 20) => {
  const response = await authFetch(`${API_URL}/category/${categoryId}/search?page=${page}&size=${size}&sort=${sort}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filterRequest),
  });
  return response.json();
};
