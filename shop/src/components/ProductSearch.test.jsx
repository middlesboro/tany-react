import React from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
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
  },
  {
    id: 4,
    title: 'Discounted Product',
    shortDescription: 'Description',
    price: 40.0,
    discountPrice: 35.0,
    images: ['image4.jpg'],
    quantity: 5,
    slug: 'discounted-product'
  }
];

describe('ProductSearch', () => {
  beforeEach(() => {
    searchProducts.mockResolvedValue(mockProducts);
  });

  afterEach(() => {
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

    await waitFor(() => {
      expect(searchProducts).toHaveBeenCalledWith('Prod');
    }, { timeout: 2000 });

    // Check In Stock Product
    const inStockTitle = await screen.findByText('In Stock Product');
    const inStockItem = inStockTitle.closest('li');
    expect(within(inStockItem).getByText('10.00 €')).toBeInTheDocument();
    expect(within(inStockItem).getByText('Skladom')).toBeInTheDocument();

    // Check Out of Stock Product
    const outOfStockTitle = screen.getByText('Out of Stock Product');
    const outOfStockItem = outOfStockTitle.closest('li');
    expect(within(outOfStockItem).getByText('20.00 €')).toBeInTheDocument();
    expect(within(outOfStockItem).getByText('Vypredané')).toBeInTheDocument();

    // Check External Stock Product
    const externalStockTitle = await screen.findByText('External Stock Product');
    const externalStockItem = externalStockTitle.closest('li');
    expect(within(externalStockItem).getByText('Skladom u dodávateľa')).toBeInTheDocument();

    // Check Discounted Product
    const discountedTitle = await screen.findByText('Discounted Product');
    const discountedItem = discountedTitle.closest('li');
    expect(within(discountedItem).getByText('40.00 €')).toBeInTheDocument(); // Original price
    expect(within(discountedItem).getByText('35.00 €')).toBeInTheDocument(); // Discounted price

    // Check that description is NOT present (regression test)
    expect(screen.queryByText('Description')).not.toBeInTheDocument();
  });
});
