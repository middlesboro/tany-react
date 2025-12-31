const API_URL = `${process.env.REACT_APP_API_URL}`;

export const login = async (email) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
};

export const exchangeToken = async (authorizationCode) => {
  const response = await fetch(`${API_URL}/login/exchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ authorizationCode }),
  });
  if (!response.ok) {
    throw new Error('Token exchange failed');
  }
  const data = await response.json();
  return data.token;
};

export const setToken = (token) => {
  localStorage.setItem('auth_token', token);
};

export const getToken = () => {
  return localStorage.getItem('auth_token');
};

export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

export const getUserEmail = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    return decoded.email || decoded.sub || null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
