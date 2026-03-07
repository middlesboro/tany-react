import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ProductSearch from './ProductSearch';
import { searchProducts } from '../services/productAdminService';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../services/productAdminService');

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
    searchProducts.mockResolvedValue(mockProducts);
  });

  afterEach(() => {
    vi.clearAllMocks();
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

    await act(async () => {
        fireEvent.change(input, { target: { value: 'Test' } });
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
  }, 10000);
});
