import { getToken, isTokenExpired, refreshToken, removeToken } from '../services/authService';

export const authFetch = async (url, options = {}) => {
  let token = getToken();

  // Proactive refresh if token is expired
  if (token && isTokenExpired()) {
    try {
      token = await refreshToken();
    } catch (error) {
      // Refresh failed
      // dispatch auth_error?
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
    if (token) {
        try {
            const newToken = await refreshToken();
            response = await fetch(url, { ...options, headers: getHeaders(newToken) });
            if (response.status === 401 || response.status === 403) {
              removeToken();
              window.dispatchEvent(new CustomEvent('auth_error'));
            }
        } catch (error) {
            removeToken();
            // Since admin doesn't seem to have a global auth_error listener yet,
            // we can just let it fail or force reload/redirect.
            // Ideally we should dispatch an event that App.js listens to.
            // For now, I'll dispatch it in case we add it.
            // Also, removing token will cause next navigation to redirect.
             window.dispatchEvent(new CustomEvent('auth_error'));
        }
    } else {
         window.dispatchEvent(new CustomEvent('auth_error'));
    }
  }

  return response;
};
