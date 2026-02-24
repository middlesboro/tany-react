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

vi.mock('../context/CookieConsentContext', () => ({
  useCookieConsent: () => ({ consent: { marketing: false } })
}));

// Mock components that might cause issues
vi.mock('../components/ProductLabel', () => ({ default: () => null }));
vi.mock('../components/ProductCard', () => ({ default: () => null }));
vi.mock('../components/ProductJsonLd', () => ({ default: () => null }));
vi.mock('../components/StarRating', () => ({ default: () => null }));
vi.mock('../components/AddToCartButton', () => ({ default: ({ onClick }) => <button onClick={onClick}>Add to Cart</button> }));

describe('ProductDetail Shipping Info', () => {
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
    categoryService.getCategories.mockResolvedValue([]);
  });

  test('displays "Odosielame približne do 24 hodín" when quantity > 0 and externalStock false', async () => {
    const mockProduct = {
      id: 'p1',
      title: 'Test Product',
      price: 10,
      images: [],
      description: 'Test description',
      quantity: 10,
      externalStock: false
    };

    productService.getProductBySlug.mockResolvedValue(mockProduct);

    render(
      <HelmetProvider>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Odosielame približne do 24 hodín')).toBeInTheDocument();
    });
  });

  test('displays "Odosielam zvyčajne do 3-5 pracovných dní" when externalStock true', async () => {
    const mockProduct = {
      id: 'p1',
      title: 'Test Product',
      price: 10,
      images: [],
      description: 'Test description',
      quantity: 10,
      externalStock: true
    };

    productService.getProductBySlug.mockResolvedValue(mockProduct);

    render(
      <HelmetProvider>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Odosielam zvyčajne do 3-5 pracovných dní')).toBeInTheDocument();
    });
  });

  test('does NOT display "Odosielame približne do 24 hodín" when quantity = 0 and externalStock false', async () => {
    const mockProduct = {
      id: 'p1',
      title: 'Test Product',
      price: 10,
      images: [],
      description: 'Test description',
      quantity: 0,
      externalStock: false
    };

    productService.getProductBySlug.mockResolvedValue(mockProduct);

    render(
      <HelmetProvider>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
        // We verify that the text is NOT present.
        // screen.queryByText returns null if not found.
      expect(screen.queryByText('Odosielame približne do 24 hodín')).not.toBeInTheDocument();
      // Ensure we render the correct state
      expect(screen.getByText('Vypredané')).toBeInTheDocument();
    });
  });

  test('displays StockNotificationForm with correct responsive layout when quantity = 0', async () => {
    const mockProduct = {
      id: 'p1',
      title: 'Test Product',
      price: 10,
      images: [],
      description: 'Test description',
      quantity: 0,
      externalStock: false
    };

    productService.getProductBySlug.mockResolvedValue(mockProduct);

    render(
      <HelmetProvider>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
        // Use the button to find the container, as there might be multiple email inputs (e.g. in reviews)
        const button = screen.getByRole('button', { name: 'Strážiť' });
        expect(button).toBeInTheDocument();
        // Check the container of input and button
        const container = button.parentElement;
        // Verify classes for responsive layout: flex-col sm:flex-row
        expect(container).toHaveClass('flex-col');
        expect(container).toHaveClass('sm:flex-row');
    });
  });
});
