import { authFetch } from '../utils/authFetch';

const API_ADMIN_URL = `${process.env.REACT_APP_API_URL}/admin/products`;

export const getAdminProducts = async (page = 0, sort = 'title,asc', size = 20, filter = {}) => {
  const params = new URLSearchParams({
    page,
    size,
    sort,
  });

  if (filter.query) params.append('query', filter.query);
  if (filter.priceFrom) params.append('priceFrom', filter.priceFrom);
  if (filter.priceTo) params.append('priceTo', filter.priceTo);
  if (filter.brandId) params.append('brandId', filter.brandId);
  if (filter.id) params.append('id', filter.id);
  if (filter.externalStock !== undefined && filter.externalStock !== '') params.append('externalStock', filter.externalStock);
  if (filter.quantity) params.append('quantity', filter.quantity);
  if (filter.active !== undefined && filter.active !== '') params.append('active', filter.active);

  const response = await authFetch(`${API_ADMIN_URL}?${params.toString()}`);
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

export const searchProducts = async (query) => {
  const response = await authFetch(`${API_ADMIN_URL}/search?query=${encodeURIComponent(query)}`);
  return response.json();
};

export const getProductsByFilterValue = async (filterParameterValueId) => {
  const response = await authFetch(`${API_ADMIN_URL}/by-filter-value/${filterParameterValueId}`);
  return response.json();
};

export const patchProduct = async (id, patchDto) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patchDto),
  });
  return response.json();
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
