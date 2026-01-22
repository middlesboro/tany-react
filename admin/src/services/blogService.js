
const API_URL = `${process.env.REACT_APP_API_URL}/blogs`;

export const getBlogs = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
      throw new Error('Failed to fetch blogs');
  }
  return response.json();
};

export const getBlog = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
      if (response.status === 404) {
          return null;
      }
      throw new Error('Failed to fetch blog');
  }
  return response.json();
};
