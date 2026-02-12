import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Brands from './Brands';
import * as brandService from '../services/brandService';

// Mock the brandService
vi.mock('../services/brandService');

const mockBrands = [
  {
    id: '1',
    name: 'Brand 1',
    image: 'http://example.com/image1.jpg',
    active: true
  },
  {
    id: '2',
    name: 'Brand 2',
    image: null, // Test without image
    active: true
  },
  {
    id: '3',
    name: 'Inactive Brand',
    image: 'http://example.com/image3.jpg',
    active: false
  }
];

describe('Brands Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    brandService.getBrands.mockReturnValue(new Promise(() => {})); // Never resolves
    render(
      <HelmetProvider>
        <BrowserRouter>
          <Brands />
        </BrowserRouter>
      </HelmetProvider>
    );
    expect(screen.getByText('Načítavam...')).toBeInTheDocument();
  });

  test('renders brands after loading', async () => {
    brandService.getBrands.mockResolvedValue({ content: mockBrands });

    render(
      <HelmetProvider>
        <BrowserRouter>
          <Brands />
        </BrowserRouter>
      </HelmetProvider>
    );

    // Should wait for loading to finish
    await waitFor(() => {
        expect(screen.queryByText('Načítavam...')).not.toBeInTheDocument();
    });

    // Brand 1 should be visible
    expect(screen.getByText('Brand 1')).toBeInTheDocument();
    const img1 = screen.getByAltText('Brand 1');
    expect(img1).toHaveAttribute('src', 'http://example.com/image1.jpg');

    // Brand 2 should be visible (no image placeholder)
    expect(screen.getByText('Brand 2')).toBeInTheDocument();
    expect(screen.getByText('Bez obrázku')).toBeInTheDocument();

    // Brand 3 (inactive) should NOT be visible
    expect(screen.queryByText('Inactive Brand')).not.toBeInTheDocument();
  });

  test('renders error message on failure', async () => {
    brandService.getBrands.mockRejectedValue(new Error('Network error'));

    render(
      <HelmetProvider>
        <BrowserRouter>
          <Brands />
        </BrowserRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
        expect(screen.getByText('Nepodarilo sa načítať značky.')).toBeInTheDocument();
    });
  });

  test('renders empty state when no brands', async () => {
      brandService.getBrands.mockResolvedValue({ content: [] });

      render(
        <HelmetProvider>
          <BrowserRouter>
            <Brands />
          </BrowserRouter>
        </HelmetProvider>
      );

      await waitFor(() => {
          expect(screen.getByText('Momentálne neponúkame žiadne značky.')).toBeInTheDocument();
      });
  });
});
