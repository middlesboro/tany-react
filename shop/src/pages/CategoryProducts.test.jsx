import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CategoryProducts from './CategoryProducts';
import * as categoryService from '../services/categoryService';
import * as productService from '../services/productService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

// --- Mocks ---

// Mock Services
vi.mock('../services/categoryService', () => ({
  getCategories: vi.fn(),
}));

vi.mock('../services/productService', () => ({
  searchProductsByCategory: vi.fn(),
  getProduct: vi.fn(),
  getProductBySlug: vi.fn(),
}));

// Mock Hooks
vi.mock('../hooks/useMediaQuery', () => ({
  default: () => true, // Desktop
}));

vi.mock('../context/BreadcrumbContext', () => ({
  useBreadcrumbs: vi.fn(),
}));

// Mock Utils
vi.mock('../utils/analytics', () => ({
  logViewItemList: vi.fn(),
}));

vi.mock('../utils/categoryUtils', () => ({
  findCategoryBySlug: (categories, slug) => categories.find(c => c.slug === slug),
  findCategoryPath: () => [],
}));

// Mock Components
vi.mock('../components/ProductCard', () => ({
  default: () => <div data-testid="product-card">Product Card</div>,
}));

vi.mock('../components/CategoryFilter', () => ({
  default: () => <div data-testid="category-filter">Filter</div>,
}));

vi.mock('../components/SeoHead', () => ({
  default: () => null,
}));

describe('CategoryProducts', () => {
  const mockSetBreadcrumbs = vi.fn();

  const mockCategories = [
    { id: 'cat1', title: 'Test Category', slug: 'test-category', children: [] }
  ];

  const mockProductsResponse = {
    products: { content: [{ id: 'p1', title: 'Product 1' }], totalPages: 1 },
    filterParameters: [
      { id: 'f1', name: 'Brand', values: [{ id: 'v1', name: 'Nike' }] }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();

    useBreadcrumbs.mockReturnValue({ setBreadcrumbs: mockSetBreadcrumbs });
    categoryService.getCategories.mockResolvedValue(mockCategories);
    productService.searchProductsByCategory.mockResolvedValue(mockProductsResponse);
  });

  test('calls searchProductsByCategory only once with size=12 when q is empty', async () => {
    // Current behavior: Call 1 (size=1) -> Call 2 (size=12).
    // Expected behavior: Call 1 (size=12).

    render(
      <MemoryRouter initialEntries={['/kategoria/test-category']}>
        <Routes>
          <Route path="/kategoria/:slug" element={<CategoryProducts />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Wait for the product list to be rendered or fetching to complete
      expect(productService.searchProductsByCategory).toHaveBeenCalled();
    });

    // Check calls
    // Wait a bit more to ensure all effects have run
    await new Promise((resolve) => setTimeout(resolve, 100));

    const calls = productService.searchProductsByCategory.mock.calls;

    // We expect EXACTLY 1 call with size=12.
    // The arguments are: (categoryId, filterRequest, page, sort, size)
    // filterRequest usually { filterParameters: [], sort: ... }

    // Currently (before fix), calls[0] is size=1, calls[1] is size=12.
    // So this assertion should fail if the bug exists.
    expect(calls.length).toBe(1);
    expect(calls[0][4]).toBe(12); // size
  });

  test('calls searchProductsByCategory twice (schema + products) when q is present', async () => {
    // This logic is preserved.

    render(
      <MemoryRouter initialEntries={['/kategoria/test-category?q=brand-nike']}>
        <Routes>
          <Route path="/kategoria/:slug" element={<CategoryProducts />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(productService.searchProductsByCategory).toHaveBeenCalled();
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const calls = productService.searchProductsByCategory.mock.calls;

    // Expect call 1: size=1 (schema fetch)
    // Expect call 2: size=12 (product fetch with filters)
    expect(calls.length).toBeGreaterThanOrEqual(2);
    expect(calls[0][4]).toBe(1); // First call size=1
    expect(calls[1][4]).toBe(12); // Second call size=12
  });
});
