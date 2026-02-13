import React from 'react';
import { render, screen } from '@testing-library/react';
import Cart from './Cart';
import { useCart } from '../context/CartContext';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children, to }) => <a href={to}>{children}</a>
  };
});

vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(),
}));

vi.mock('../services/productService', () => ({
  searchProductsByCategory: vi.fn().mockResolvedValue({ products: { content: [] } }),
}));

vi.mock('../context/BreadcrumbContext', () => ({
  useBreadcrumbs: () => ({
    setBreadcrumbs: vi.fn(),
  }),
}));

// Mock the ModalContext
vi.mock('../context/ModalContext', () => ({
  useModal: () => ({
    openMessageModal: vi.fn(),
  }),
}));

describe('Cart Quantity Changes Integration', () => {
  const mockUpdateCart = vi.fn();
  const mockAddDiscount = vi.fn();
  const mockRemoveDiscount = vi.fn();

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
