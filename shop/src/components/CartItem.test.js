import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CartItem from './CartItem';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import { BrowserRouter } from 'react-router-dom';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Mock Contexts
jest.mock('../context/CartContext', () => ({
  useCart: jest.fn(),
}));
jest.mock('../context/ModalContext', () => ({
  useModal: jest.fn(),
}));

describe('CartItem', () => {
  const mockAddToCart = jest.fn();
  const mockRemoveFromCart = jest.fn();
  const mockOpenMessageModal = jest.fn();

  const mockItem = {
    id: 1,
    productId: 101,
    quantity: 2,
    price: 20,
    title: 'Test Product',
    slug: 'test-product',
    image: 'test.jpg'
  };

  beforeEach(() => {
    useCart.mockReturnValue({
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart
    });
    useModal.mockReturnValue({
      openMessageModal: mockOpenMessageModal
    });
    mockAddToCart.mockClear();
    mockOpenMessageModal.mockClear();
  });

  test('calls openMessageModal when addToCart returns 400', async () => {
    const error = new Error('Out of stock');
    error.status = 400;
    mockAddToCart.mockRejectedValue(error);

    render(
      <BrowserRouter>
        <CartItem item={mockItem} />
      </BrowserRouter>
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(101, 5);
      expect(mockOpenMessageModal).toHaveBeenCalledWith(
        "Upozornenie",
        "Pre tento produkt nie je na sklade dostatočné množstvo."
      );
    });

    // Verify quantity is reset
    expect(input.value).toBe('2');
  });
});
