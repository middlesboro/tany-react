import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import BrandReviews from './BrandReviews';
import { getReviewsByBrand } from '../services/reviewService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

// Mocks
jest.mock('../services/reviewService');
jest.mock('../context/BreadcrumbContext');
jest.mock('../components/StarRating', () => ({ rating }) => <div data-testid="star-rating">{rating}</div>);

describe('BrandReviews Page', () => {
  const mockSetBreadcrumbs = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useBreadcrumbs.mockReturnValue({ setBreadcrumbs: mockSetBreadcrumbs });
  });

  const renderComponent = (brandId = '123') => {
    return render(
      <HelmetProvider>
        <MemoryRouter initialEntries={[`/brand-reviews/${brandId}`]}>
          <Routes>
            <Route path="/brand-reviews/:brandId" element={<BrandReviews />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );
  };

  test('renders reviews and product info', async () => {
    const mockReviews = {
        reviews: {
            content: [
                {
                    id: 1,
                    rating: 5,
                    title: 'Great product',
                    text: 'I loved it',
                    createDate: '2023-01-01T12:00:00Z',
                    customerName: 'John Doe',
                    productSlug: 'product-slug',
                    productName: 'Awesome Product',
                    productImage: 'http://example.com/image.jpg'
                }
            ],
            totalPages: 1
        },
        averageRating: 4.5,
        reviewsCount: 1
    };
    getReviewsByBrand.mockResolvedValue(mockReviews);

    renderComponent();

    expect(screen.getByText('Načítavam hodnotenia...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Načítavam hodnotenia...')).not.toBeInTheDocument();
    });

    // Check review content
    expect(screen.getByText('Great product')).toBeInTheDocument();
    expect(screen.getByText('I loved it')).toBeInTheDocument();

    // Check product name
    expect(screen.getByText('Awesome Product')).toBeInTheDocument();

    // Check for image
    const img = screen.getByRole('img', { name: 'Awesome Product' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'http://example.com/image.jpg');

    // Check for links (both image and text might link to product)
    const links = screen.getAllByRole('link', { name: 'Awesome Product' });
    expect(links.length).toBeGreaterThanOrEqual(1);
    links.forEach(link => {
        expect(link).toHaveAttribute('href', '/product/product-slug');
    });
  });

  test('calls getReviewsByBrand with list of brandIds', async () => {
    const mockReviews = {
      reviews: { content: [], totalPages: 0 },
      averageRating: 0,
      reviewsCount: 0
    };
    getReviewsByBrand.mockResolvedValue(mockReviews);

    const brandIds = ['123', '456'];
    render(
      <HelmetProvider>
        <MemoryRouter>
          <BrandReviews brandIds={brandIds} />
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
        // We expect the first argument to be the array of brand IDs
        expect(getReviewsByBrand).toHaveBeenCalledWith(['123', '456'], 0, 30);
    });
  });
});
