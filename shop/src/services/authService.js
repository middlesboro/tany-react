const API_URL = `${process.env.REACT_APP_API_URL}`;

export const requestMagicLink = async (email) => {
  const response = await fetch(`/auth/magic-link/request?email=${encodeURIComponent(email)}`, {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error('Failed to request magic link');
  }
};

export const generatePKCE = async () => {
  const array = new Uint32Array(56/2);
  window.crypto.getRandomValues(array);
  const verifier = Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');

  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return { verifier, challenge };
};

export const exchangeToken = async (code, verifier) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', 'public-client');
  // Dynamic redirect URI based on current origin, must match what was sent in authorize request
  params.append('redirect_uri', `${window.location.origin}/oauth/callback`);
  params.append('code', code);
  params.append('code_verifier', verifier);

  const response = await fetch(`/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });

  if (!response.ok) {
    let errorMessage = 'Token exchange failed';
    try {
        const err = await response.json();
        if (err.error_description) errorMessage = err.error_description;
    } catch (e) {}
    throw new Error(errorMessage);
  }
  const data = await response.json();
  return data;
};

export const setToken = (data) => {
  if (typeof data === 'string') {
    localStorage.setItem('auth_token', data);
    return;
  }
  if (data.access_token) {
    localStorage.setItem('auth_token', data.access_token);
  }
  if (data.refresh_token) {
    localStorage.setItem('refresh_token', data.refresh_token);
  }
  if (data.expires_in) {
    // expires_in is in seconds. Calculate absolute time.
    const expiresAt = Date.now() + (data.expires_in * 1000);
    localStorage.setItem('token_expiration', expiresAt);
  }
};

export const getToken = () => {
  return localStorage.getItem('auth_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export const removeToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expiration');
};

export const isTokenExpired = () => {
  const expiration = localStorage.getItem('token_expiration');
  if (!expiration) return false;
  // Check if expired or about to expire (within 1 minute)
  return Date.now() > (parseInt(expiration) - 60000);
};

export const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('client_id', 'public-client');
  params.append('refresh_token', refresh);

  const response = await fetch(`/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });

  if (!response.ok) {
    removeToken();
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  setToken(data);
  return data.access_token;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

export const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const getUserEmail = () => {
  const decoded = getDecodedToken();
  return decoded ? (decoded.email || decoded.sub || null) : null;
};

// Deprecated or Legacy support
export const login = requestMagicLink;
