import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderCreateItems from './OrderCreateItems';
import { searchProducts } from '../services/productAdminService';

vi.mock('../services/productAdminService');

describe('OrderCreateItems', () => {
  const mockOnAddItem = vi.fn();
  const mockOnRemoveItem = vi.fn();
  const mockOnUpdateItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders added items', () => {
    const items = [
      { name: 'Product 1', quantity: 2, image: 'img1.jpg', price: 10 },
      { name: 'Product 2', quantity: 1, image: 'img2.jpg', price: 20 }
    ];

    render(
      <OrderCreateItems
        items={items}
        onAddItem={mockOnAddItem}
        onRemoveItem={mockOnRemoveItem}
        onUpdateItem={mockOnUpdateItem}
      />
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  test('displays stock quantity if present', () => {
    const items = [
      { name: 'Product with Stock', quantity: 1, stockQuantity: 50, price: 10 }
    ];

    render(
      <OrderCreateItems
        items={items}
        onAddItem={mockOnAddItem}
        onRemoveItem={mockOnRemoveItem}
        onUpdateItem={mockOnUpdateItem}
      />
    );

    expect(screen.getByText('Stock: 50')).toBeInTheDocument();
  });

  test('adds item with stock quantity from search', async () => {
    const mockProduct = {
      id: 1,
      title: 'Searched Product',
      quantity: 100, // Stock quantity
      price: 50,
      images: ['img.jpg']
    };

    searchProducts.mockResolvedValue([mockProduct]);

    render(
      <OrderCreateItems
        items={[]}
        onAddItem={mockOnAddItem}
        onRemoveItem={mockOnRemoveItem}
        onUpdateItem={mockOnUpdateItem}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search products to add...');
    fireEvent.change(searchInput, { target: { value: 'Sear' } });

    // Wait for search results
    await waitFor(() => {
      expect(screen.getByText('Searched Product')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Searched Product'));

    expect(mockOnAddItem).toHaveBeenCalledWith({
      id: 1,
      name: 'Searched Product',
      quantity: 1,
      image: 'img.jpg',
      price: 50,
      stockQuantity: 100
    });
  });
});
