import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ProductSearch from './ProductSearch';
import { searchProducts } from '../services/productService';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../services/productService');

const mockProducts = [
  {
    id: 1,
    title: 'Test Product',
    shortDescription: 'This is a description',
    price: 10.0,
    images: ['image.jpg']
  }
];

describe('ProductSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    searchProducts.mockResolvedValue(mockProducts);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('renders results without description', async () => {
    await act(async () => {
        render(
        <MemoryRouter>
            <ProductSearch />
        </MemoryRouter>
        );
    });

    const input = screen.getByPlaceholderText('Hľadať v obchode...');
    fireEvent.change(input, { target: { value: 'Test' } });

    // Advance timers to trigger debounce
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(searchProducts).toHaveBeenCalledWith('Test');
    });

    const title = await screen.findByText('Test Product');
    expect(title).toBeInTheDocument();

    // Check if price is present
    expect(screen.getByText('10.00 €')).toBeInTheDocument();

    // Check if description is NOT present
    const description = screen.queryByText('This is a description');
    expect(description).not.toBeInTheDocument();
  });
});
