import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CartItem from './CartItem';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import { BrowserRouter } from 'react-router-dom';

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Link: ({ children, to }) => <a href={to}>{children}</a>
  };
});

// Mock Contexts
vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(),
}));
vi.mock('../context/ModalContext', () => ({
  useModal: vi.fn(),
}));

describe('CartItem', () => {
  const mockAddToCart = vi.fn();
  const mockRemoveFromCart = vi.fn();
  const mockOpenMessageModal = vi.fn();

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
