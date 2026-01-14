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

export const getProductsByCategory = async (categoryId, page = 0, sort = 'title,asc', size = 20, filters = []) => {
  let url = `${API_URL}/category/${categoryId}?page=${page}&size=${size}&sort=${sort}`;

  // Serialize filters into query parameters
  // Expected format: filter_{paramId}={valueId1},{valueId2}
  if (filters && filters.length > 0) {
    const params = new URLSearchParams();
    filters.forEach(f => {
      if (f.filterParameterValueIds && f.filterParameterValueIds.length > 0) {
        params.append(`filter_${f.id}`, f.filterParameterValueIds.join(','));
      }
    });
    const filterQuery = params.toString();
    if (filterQuery) {
        url += `&${filterQuery}`;
    }
  }

  const response = await authFetch(url);
  return response.json();
};

export const searchProducts = async (query) => {
  const response = await authFetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  return response.json();
};
