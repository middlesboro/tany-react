import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import ProductDetail from './ProductDetail';
import * as productService from '../services/productService';
import * as categoryService from '../services/categoryService';
import * as reviewService from '../services/reviewService';
import * as wishlistService from '../services/wishlistService';
import * as authService from '../services/authService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

// Mock mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ slug: 'test-product' }),
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

jest.mock('../services/productService');
jest.mock('../services/categoryService');
jest.mock('../services/reviewService');
jest.mock('../services/wishlistService');
jest.mock('../services/authService');
jest.mock('../services/customerService'); // for createEmailNotification

jest.mock('../context/CartContext', () => ({
  useCart: () => ({ addToCart: jest.fn() })
}));

jest.mock('../context/ModalContext', () => ({
  useModal: () => ({ openLoginModal: jest.fn(), openMessageModal: jest.fn() })
}));

jest.mock('../context/BreadcrumbContext', () => ({
  useBreadcrumbs: jest.fn()
}));

// Mock components that might cause issues
jest.mock('../components/ProductLabel', () => () => null);
jest.mock('../components/ProductCard', () => () => null);
jest.mock('../components/ProductJsonLd', () => () => null);
jest.mock('../components/StarRating', () => () => null);
jest.mock('../components/AddToCartButton', () => ({ onClick }) => <button onClick={onClick}>Add to Cart</button>);

describe('ProductDetail Breadcrumbs', () => {
  const mockSetBreadcrumbs = jest.fn();

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

    render(<ProductDetail />);

    await waitFor(() => {
      expect(mockSetBreadcrumbs).toHaveBeenCalledWith([
        { label: 'Domov', path: '/' },
        { label: 'Test Category', path: '/category/test-category' },
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

    render(<ProductDetail />);

    await waitFor(() => {
        // Should find path: Domov -> Parent -> Child -> Product
      expect(mockSetBreadcrumbs).toHaveBeenCalledWith([
        { label: 'Domov', path: '/' },
        { label: 'Parent Category', path: '/category/parent-category' },
        { label: 'Child Category', path: '/category/child-category' },
        { label: 'Test Product', path: null }
      ]);
    });
  });
});
