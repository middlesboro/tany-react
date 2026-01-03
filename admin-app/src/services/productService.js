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
