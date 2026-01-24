import { authFetch } from './authFetch';
import * as authService from '../services/authService';

jest.mock('../services/authService');

describe('authFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() => Promise.resolve({
      status: 200,
      json: () => Promise.resolve({}),
      ok: true
    }));
  });

  it('should send Authorization header if token exists and is NOT expired', async () => {
    authService.getToken.mockReturnValue('valid-token');
    authService.isTokenExpired.mockReturnValue(false);

    await authFetch('/api/test');

    const fetchCallArgs = global.fetch.mock.calls[0];
    const options = fetchCallArgs[1];
    const headers = options.headers;

    expect(headers.has('Authorization')).toBe(true);
    expect(headers.get('Authorization')).toBe('Bearer valid-token');
  });

  it('should NOT send Authorization header if token exists but IS expired', async () => {
    authService.getToken.mockReturnValue('expired-token');
    authService.isTokenExpired.mockReturnValue(true);

    await authFetch('/api/test');

    const fetchCallArgs = global.fetch.mock.calls[0];
    const options = fetchCallArgs[1];
    const headers = options.headers;

    expect(headers.has('Authorization')).toBe(false);
  });

  it('should NOT send Authorization header if token does not exist', async () => {
    authService.getToken.mockReturnValue(null);
    // isTokenExpired behavior depends on implementation when token is null,
    // but authFetch usually checks `if (token)` first.
    // We mock it anyway just in case.
    authService.isTokenExpired.mockReturnValue(true);

    await authFetch('/api/test');

    const fetchCallArgs = global.fetch.mock.calls[0];
    const options = fetchCallArgs[1];
    const headers = options.headers;

    expect(headers.has('Authorization')).toBe(false);
  });
});
