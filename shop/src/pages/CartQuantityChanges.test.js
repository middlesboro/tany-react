import React from 'react';
import { render, screen } from '@testing-library/react';
import Cart from './Cart';
import { useCart } from '../context/CartContext';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

jest.mock('../context/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('../services/productService', () => ({
  searchProductsByCategory: jest.fn().mockResolvedValue({ products: { content: [] } }),
}));

jest.mock('../context/BreadcrumbContext', () => ({
  useBreadcrumbs: () => ({
    setBreadcrumbs: jest.fn(),
  }),
}));

// Mock the ModalContext
jest.mock('../context/ModalContext', () => ({
  useModal: () => ({
    openMessageModal: jest.fn(),
  }),
}));

describe('Cart Quantity Changes Integration', () => {
  const mockUpdateCart = jest.fn();
  const mockAddDiscount = jest.fn();
  const mockRemoveDiscount = jest.fn();

  beforeEach(() => {
    mockUpdateCart.mockResolvedValue({});
    mockAddDiscount.mockResolvedValue({});
    mockRemoveDiscount.mockResolvedValue({});
  });

  test('displays quantity changes notification in Cart', () => {
    const mockCart = {
      cartId: '123',
      items: [
        { id: 1, title: 'Product 1', price: 10, quantity: 1, total: 10 }
      ],
      quantityChanges: [
        {
          productId: '2',
          productName: 'Removed Item',
          currentQuantity: 0,
          requestedQuantity: 5
        }
      ],
      appliedDiscounts: [],
      finalPrice: 10,
      totalProductPrice: 10,
      discountForNewsletter: false
    };

    useCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      addDiscount: mockAddDiscount,
      removeDiscount: mockRemoveDiscount,
      updateCart: mockUpdateCart,
    });

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    expect(screen.getByText('Removed Item')).toBeInTheDocument();
    expect(screen.getByText(/bol odstránený z košíka/)).toBeInTheDocument();
  });

  test('displays quantity changes notification even if cart items are empty', () => {
    const mockCart = {
      cartId: '123',
      items: [], // Empty items
      quantityChanges: [
        {
          productId: '2',
          productName: 'Last Item',
          currentQuantity: 0,
          requestedQuantity: 1
        }
      ],
      appliedDiscounts: [],
      finalPrice: 0,
      totalProductPrice: 0,
      discountForNewsletter: false
    };

    useCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      addDiscount: mockAddDiscount,
      removeDiscount: mockRemoveDiscount,
      updateCart: mockUpdateCart,
    });

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    // Should show "Your cart is empty" AND the notification
    expect(screen.getByText('Váš košík je prázdny.')).toBeInTheDocument();
    expect(screen.getByText('Last Item')).toBeInTheDocument();
    expect(screen.getByText(/bol odstránený z košíka/)).toBeInTheDocument();
  });
});
