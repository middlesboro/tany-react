const API_URL = `${process.env.REACT_APP_API_URL}/customers`;

export const getCustomers = async (page = 0, sort = 'lastname,asc', size = 20) => {
  const response = await fetch(`${API_URL}?page=${page}&size=${size}&sort=${sort}`);
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
