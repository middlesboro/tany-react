const API_URL = `${process.env.REACT_APP_API_URL}/categories`;

export const getCategories = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data.content;
};

export const getCategory = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
};

export const createCategory = async (category) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
  return response.json();
};

export const updateCategory = async (id, category) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
  return response.json();
};

export const deleteCategory = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
};
