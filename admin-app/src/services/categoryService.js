import { authFetch } from '../utils/authFetch';

const API_URL = `${process.env.REACT_APP_API_URL}/categories`;

export const getCategories = async () => {
  const response = await authFetch(API_URL);
  return response.json();
};

export const filterCategories = async (categoryId, filterRequest) => {
    const response = await authFetch(`${API_URL}/${categoryId}/filter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterRequest),
    });
    return response.json();
};
