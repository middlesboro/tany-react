import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We want to test the module state (caching), so we need to reload it for each test or isolate it.
// Vitest reuses modules by default. We should import dynamically or use `vi.resetModules()`.

describe('categoryService', () => {
  let categoryService;
  let authFetchMock;

  beforeEach(async () => {
    vi.resetModules();

    // Mock authFetch before importing the service
    // Default to success
    authFetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, title: 'Category 1' }]
    });

    vi.doMock('../utils/authFetch', () => ({
      authFetch: authFetchMock
    }));

    // Import the service under test
    categoryService = await import('./categoryService');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls authFetch only once (caches promise)', async () => {
    const promise1 = categoryService.getCategories();
    const promise2 = categoryService.getCategories();

    await Promise.all([promise1, promise2]);

    expect(authFetchMock).toHaveBeenCalledTimes(1);
  });

  it('clears cache on error (rejected promise)', async () => {
    authFetchMock.mockRejectedValueOnce(new Error('Network error'));

    try {
        await categoryService.getCategories();
    } catch (e) {
        // expected
    }

    // Should try again
    authFetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, title: 'Category 1' }]
    });

    await categoryService.getCategories();

    expect(authFetchMock).toHaveBeenCalledTimes(2);
  });

  it('clears cache on non-ok response', async () => {
    authFetchMock.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Bad Request' })
    });

    const promise1 = categoryService.getCategories();
    await promise1;

    // Should clear cache so next call retries
    authFetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, title: 'Category 1' }]
    });

    await categoryService.getCategories();

    expect(authFetchMock).toHaveBeenCalledTimes(2);
  });
});
