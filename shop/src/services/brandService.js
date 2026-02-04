import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/brands`;

export const getBrands = async (page = 0, size = 100, sort = 'name,asc') => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort
  });
  const response = await authFetch(`${API_URL}?${queryParams}`);
  if (response.status === 204) {
      return { content: [] };
  }
  return response.json();
};
