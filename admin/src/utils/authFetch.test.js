import { authFetch } from './authFetch';
import { getToken } from '../services/authService';

vi.mock('../services/authService');

describe('authFetch', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    delete window.location;
    window.location = { href: '' };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    window.location.href = '';
    global.fetch = vi.fn();
  });

  it('should add Authorization header if token exists', async () => {
    getToken.mockReturnValue('mock-token');
    global.fetch.mockResolvedValue({ status: 200, ok: true });

    await authFetch('/api/test');

    const callArgs = global.fetch.mock.calls[0];
    const headers = callArgs[1].headers;
    // Handle both Headers object and plain object if implementation changes
    const authHeader = headers instanceof Headers ? headers.get('Authorization') : headers['Authorization'];
    expect(authHeader).toBe('Bearer mock-token');
  });

  it('should redirect to /admin/login on 401', async () => {
    getToken.mockReturnValue('mock-token');
    global.fetch.mockResolvedValue({ status: 401, ok: false });

    await authFetch('/api/test');

    expect(window.location.href).toBe('/admin/login');
  });

  it('should return response if not 401', async () => {
    getToken.mockReturnValue('mock-token');
    const mockResponse = { status: 200, ok: true, json: () => ({}) };
    global.fetch.mockResolvedValue(mockResponse);

    const response = await authFetch('/api/test');

    expect(response).toBe(mockResponse);
    expect(window.location.href).toBe('');
  });
});
