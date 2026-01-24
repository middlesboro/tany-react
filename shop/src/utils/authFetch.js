import { getToken, isTokenExpired, refreshToken, removeToken } from '../services/authService';

export const authFetch = async (url, options = {}) => {
  let token = getToken();

  // Proactive refresh if token is expired
  if (token && isTokenExpired()) {
    try {
      token = await refreshToken();
    } catch (error) {
      // Refresh failed, continue without token (will likely result in 401)
      // or handle error. existing logic dispatches auth_error on 401.
    }
  }

  const getHeaders = (t) => {
    const h = options.headers ? new Headers(options.headers) : new Headers();
    if (t) {
      h.set('Authorization', `Bearer ${t}`);
    }
    return h;
  };

  let response = await fetch(url, { ...options, headers: getHeaders(token) });

  if (response.status === 401) {
    // If we receive 401, try to refresh token (if we have one and haven't just refreshed it?
    // - actually if proactive refresh succeeded, we shouldn't get 401 unless token is invalid.
    // - if proactive refresh failed, we are sending request with potentially expired/invalid token.
    if (token) {
        try {
            const newToken = await refreshToken();
            // Retry request with new token
            response = await fetch(url, { ...options, headers: getHeaders(newToken) });
        } catch (error) {
            // Refresh failed or retry failed
            removeToken();
            window.dispatchEvent(new CustomEvent('auth_error'));
        }
    } else {
        window.dispatchEvent(new CustomEvent('auth_error'));
    }
  } else if (response.status === 403) {
    window.dispatchEvent(new CustomEvent('auth_error'));
  }

  return response;
};
