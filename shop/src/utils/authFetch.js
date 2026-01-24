import { getToken, isTokenExpired } from '../services/authService';

export const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = options.headers ? new Headers(options.headers) : new Headers();

  if (token && !isTokenExpired()) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  // Preserve other headers (Content-Type is set in services)
  const newOptions = {
    ...options,
    headers: headers,
  };

  const response = await fetch(url, newOptions);

  if (response.status === 401 || response.status === 403) {
    window.dispatchEvent(new CustomEvent('auth_error'));
  }

  return response;
};
