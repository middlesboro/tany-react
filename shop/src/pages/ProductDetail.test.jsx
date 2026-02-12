import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ProductDetail from './ProductDetail';
import * as productService from '../services/productService';
import * as categoryService from '../services/categoryService';
import * as reviewService from '../services/reviewService';
import * as wishlistService from '../services/wishlistService';
import * as authService from '../services/authService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

// Mock mocks
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: () => ({ slug: 'test-product' }),
    Link: ({ children, to }) => <a href={to}>{children}</a>
  };
});

vi.mock('../services/productService');
vi.mock('../services/categoryService');
vi.mock('../services/reviewService');
vi.mock('../services/wishlistService');
vi.mock('../services/authService');
vi.mock('../services/customerService'); // for createEmailNotification

vi.mock('../context/CartContext', () => ({
  useCart: () => ({ addToCart: vi.fn() })
}));

vi.mock('../context/ModalContext', () => ({
  useModal: () => ({ openLoginModal: vi.fn(), openMessageModal: vi.fn() })
}));

vi.mock('../context/BreadcrumbContext', () => ({
  useBreadcrumbs: vi.fn()
}));

// Mock components that might cause issues
vi.mock('../components/ProductLabel', () => () => null);
vi.mock('../components/ProductCard', () => () => null);
vi.mock('../components/ProductJsonLd', () => () => null);
vi.mock('../components/StarRating', () => () => null);
vi.mock('../components/AddToCartButton', () => ({ onClick }) => <button onClick={onClick}>Add to Cart</button>);

describe('ProductDetail Breadcrumbs', () => {
  const mockSetBreadcrumbs = vi.fn();

  beforeEach(() => {
    useBreadcrumbs.mockReturnValue({ setBreadcrumbs: mockSetBreadcrumbs });
    mockSetBreadcrumbs.mockClear();

    productService.getRelatedProducts.mockResolvedValue([]);
    reviewService.getReviewsByProduct.mockResolvedValue({
      reviews: { content: [], totalPages: 0 },
      averageRating: 0,
      reviewsCount: 0
    });
    wishlistService.addToWishlist.mockResolvedValue({});
    wishlistService.removeFromWishlist.mockResolvedValue({});
    authService.getUserEmail.mockReturnValue('test@example.com');
    authService.isAuthenticated.mockReturnValue(true);
  });

  test('uses defaultCategoryTitle and defaultCategoryId for breadcrumbs when present', async () => {
    const mockProduct = {
      id: 'p1',
      title: 'Test Product',
      defaultCategoryTitle: 'Test Category',
      defaultCategoryId: 'c1',
      price: 10,
      images: [],
      description: 'Test description',
      quantity: 10
    };

    const mockCategories = [
      { id: 'c1', title: 'Test Category', slug: 'test-category', children: [] }
    ];

    productService.getProductBySlug.mockResolvedValue(mockProduct);
    categoryService.getCategories.mockResolvedValue(mockCategories);

    render(
      <HelmetProvider>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(mockSetBreadcrumbs).toHaveBeenCalledWith([
        { label: 'Domov', path: '/' },
        { label: 'Test Category', path: '/kategoria/test-category' },
        { label: 'Test Product', path: null }
      ]);
    });
  });

  test('falls back to category tree search when defaultCategoryTitle is missing', async () => {
    const mockProduct = {
      id: 'p1',
      title: 'Test Product',
      // No defaultCategoryTitle/Id
      categoryId: 'c2',
      price: 10,
      images: [],
      description: 'Test description',
      quantity: 10
    };

    const mockCategories = [
      {
        id: 'c1',
        title: 'Parent Category',
        slug: 'parent-category',
        children: [
            { id: 'c2', title: 'Child Category', slug: 'child-category', children: [] }
        ]
      }
    ];

    productService.getProductBySlug.mockResolvedValue(mockProduct);
    categoryService.getCategories.mockResolvedValue(mockCategories);

    render(
      <HelmetProvider>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
        // Should find path: Domov -> Parent -> Child -> Product
      expect(mockSetBreadcrumbs).toHaveBeenCalledWith([
        { label: 'Domov', path: '/' },
        { label: 'Parent Category', path: '/kategoria/parent-category' },
        { label: 'Child Category', path: '/kategoria/child-category' },
        { label: 'Test Product', path: null }
      ]);
    });
  });
});
