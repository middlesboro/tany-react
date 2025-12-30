const API_URL = `${process.env.REACT_APP_API_URL}/customers`;

export const getCustomers = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const getCustomer = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
};

export const createCustomer = async (customer) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });
  return response.json();
};

export const updateCustomer = async (id, customer) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });
  return response.json();
};

export const deleteCustomer = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
};
