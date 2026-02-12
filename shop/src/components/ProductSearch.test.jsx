import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ProductSearch from './ProductSearch';
import { searchProducts } from '../services/productService';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../services/productService');

const mockProducts = [
  {
    id: 1,
    title: 'In Stock Product',
    shortDescription: 'Description',
    price: 10.0,
    images: ['image1.jpg'],
    quantity: 10,
    slug: 'in-stock-product'
  },
  {
    id: 2,
    title: 'Out of Stock Product',
    shortDescription: 'Description',
    price: 20.0,
    images: ['image2.jpg'],
    quantity: 0,
    slug: 'out-of-stock-product'
  },
  {
    id: 3,
    title: 'External Stock Product',
    shortDescription: 'Description',
    price: 30.0,
    images: ['image3.jpg'],
    quantity: 0,
    externalStock: true,
    slug: 'external-stock-product'
  }
];

describe('ProductSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    searchProducts.mockResolvedValue(mockProducts);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  test('renders results with stock status', async () => {
    await act(async () => {
        render(
        <MemoryRouter>
            <ProductSearch />
        </MemoryRouter>
        );
    });

    const input = screen.getByPlaceholderText('Hľadať v obchode...');
    fireEvent.change(input, { target: { value: 'Prod' } });

    // Advance timers to trigger debounce
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(searchProducts).toHaveBeenCalledWith('Prod');
    });

    // Check In Stock Product
    const inStockTitle = await screen.findByText('In Stock Product');
    expect(inStockTitle).toBeInTheDocument();
    expect(screen.getByText('10.00 €')).toBeInTheDocument();
    expect(screen.getByText('Skladom')).toBeInTheDocument();

    // Check Out of Stock Product
    const outOfStockTitle = screen.getByText('Out of Stock Product');
    expect(outOfStockTitle).toBeInTheDocument();
    expect(screen.getByText('20.00 €')).toBeInTheDocument();
    expect(screen.getByText('Vypredané')).toBeInTheDocument();

    // Check External Stock Product
    const externalStockTitle = await screen.findByText('External Stock Product');
    expect(externalStockTitle).toBeInTheDocument();
    expect(screen.getByText('Skladom u dodávateľa')).toBeInTheDocument();

    // Check that description is NOT present (regression test)
    expect(screen.queryByText('Description')).not.toBeInTheDocument();
  });
});
