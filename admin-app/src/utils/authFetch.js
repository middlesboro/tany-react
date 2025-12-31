import { getToken } from '../services/authService';

export const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = options.headers ? new Headers(options.headers) : new Headers();

  if (token && !options.skipAuth) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  // Preserve other headers (Content-Type is set in services)
  const { skipAuth, ...fetchOptions } = options;
  const newOptions = {
    ...fetchOptions,
    headers: headers,
  };

  const response = await fetch(url, newOptions);

  return response;
};
