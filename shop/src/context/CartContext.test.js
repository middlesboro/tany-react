import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { getCustomerContext } from '../services/customerService';

// Mock services
jest.mock('../services/customerService', () => ({
  getCustomerContext: jest.fn(),
}));

jest.mock('../services/cartService', () => ({
  addToCart: jest.fn(),
  updateCart: jest.fn(),
  removeFromCart: jest.fn(),
  addDiscount: jest.fn(),
  removeDiscount: jest.fn(),
}));

const TestComponent = () => {
  const { cart, loading } = useCart();
  if (loading) return <div>Loading...</div>;
  if (!cart) return <div>No Cart</div>;
  return (
    <div>
      <span data-testid="discount-flag">{cart.discountForNewsletter ? 'true' : 'false'}</span>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('clears invalid cartId from storage and retries on 404', async () => {
      const invalidCartId = 'invalid-123';
      const newCartId = 'new-cart-123';

      localStorage.setItem('cartId', invalidCartId);

      // First call fails with 404
      const error404 = new Error('Cart not found');
      error404.status = 404;

      getCustomerContext
        .mockRejectedValueOnce(error404)
        .mockResolvedValueOnce({
              cartDto: {
                  cartId: newCartId,
                  items: [],
                  discountForNewsletter: false
              },
              customerDto: null
          });

      render(
          <CartProvider>
              <TestComponent />
          </CartProvider>
      );

      await waitFor(() => {
          expect(screen.getByTestId('discount-flag')).toHaveTextContent('false');
      });

      expect(getCustomerContext).toHaveBeenCalledTimes(2);
      expect(getCustomerContext).toHaveBeenNthCalledWith(1, invalidCartId);
      expect(getCustomerContext).toHaveBeenNthCalledWith(2, null);
      expect(localStorage.getItem('cartId')).toBe(newCartId);
  });

  test('merges discountForNewsletter from root context response into cart', async () => {
    // Mock response where discountForNewsletter is at the root, not in cartDto
    getCustomerContext.mockResolvedValue({
      cartDto: {
        cartId: '123',
        items: [],
        discountForNewsletter: false // Explicitly false or missing in DTO to prove root overrides or supplements
      },
      customerDto: null,
      discountForNewsletter: true // It is true here
    });

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
        expect(screen.getByTestId('discount-flag')).toHaveTextContent('true');
    });
  });

  test('respects discountForNewsletter from cartDto if root is undefined', async () => {
      getCustomerContext.mockResolvedValue({
          cartDto: {
              cartId: '123',
              items: [],
              discountForNewsletter: true
          },
          customerDto: null
          // root discountForNewsletter undefined
      });

      render(
          <CartProvider>
              <TestComponent />
          </CartProvider>
      );

      await waitFor(() => {
          expect(screen.getByTestId('discount-flag')).toHaveTextContent('true');
      });
  });
});
