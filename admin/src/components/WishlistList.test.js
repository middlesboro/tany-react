import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WishlistList from './WishlistList';

describe('WishlistList Component', () => {
  const mockWishlists = [
    {
      id: 1,
      customerEmail: 'test@example.com',
      productNames: ['Product A', 'Product B'],
    },
    {
      id: 2,
      customerName: 'John Doe',
      productNames: ['Product C'],
    },
    {
      id: 3,
      customerEmail: 'empty@example.com',
      productNames: [],
    },
  ];

  const mockOnDelete = jest.fn();

  test('renders wishlist table with correct headers', () => {
    render(<WishlistList wishlists={mockWishlists} onDelete={mockOnDelete} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    // This is the new header we expect
    expect(screen.getByText('Product Names')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  test('renders wishlist data correctly', () => {
    render(<WishlistList wishlists={mockWishlists} onDelete={mockOnDelete} />);

    // Check customer info
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Check product names
    expect(screen.getByText('Product A, Product B')).toBeInTheDocument();
    expect(screen.getByText('Product C')).toBeInTheDocument();
  });

  test('calls onDelete when delete button is clicked and confirmed', () => {
    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(<WishlistList wishlists={mockWishlists} onDelete={mockOnDelete} />);

    // Find delete buttons (there should be 3)
    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });
});
