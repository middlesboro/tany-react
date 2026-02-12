import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Cart from './Cart';
import { useCart } from '../context/CartContext';
import { BrowserRouter } from 'react-router-dom';
import { searchProductsByCategory } from '../services/productService';

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children, to }) => <a href={to}>{children}</a>
  };
});

// Mock the CartContext
vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(),
}));

// Mock the ProductService
vi.mock('../services/productService', () => ({
  searchProductsByCategory: vi.fn(),
}));

// Mock the ModalContext
vi.mock('../context/ModalContext', () => ({
  useModal: () => ({
    openMessageModal: vi.fn(),
  }),
}));

// Mock the BreadcrumbContext
vi.mock('../context/BreadcrumbContext', () => ({
  useBreadcrumbs: () => ({
    setBreadcrumbs: vi.fn(),
  }),
}));

describe('Cart Component', () => {
  const mockUpdateCart = vi.fn();
  const mockAddDiscount = vi.fn();
  const mockRemoveDiscount = vi.fn();

  const mockCart = {
    cartId: '123',
    items: [
        { id: 1, title: 'Product 1', price: 10, quantity: 1, total: 10 }
    ],
    appliedDiscounts: [],
    finalPrice: 10,
    totalProductPrice: 10,
    discountForNewsletter: false
  };

  beforeEach(() => {
    mockUpdateCart.mockResolvedValue({});
    mockAddDiscount.mockResolvedValue({});
    mockRemoveDiscount.mockResolvedValue({});
    searchProductsByCategory.mockResolvedValue({ products: { content: [] } });

    useCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      addDiscount: mockAddDiscount,
      removeDiscount: mockRemoveDiscount,
      updateCart: mockUpdateCart,
    });
    mockUpdateCart.mockClear();
  });

  test('renders newsletter checkbox', () => {
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    expect(screen.getByLabelText('Odber newslettera (zľava 10%)')).toBeInTheDocument();
  });

  test('calls updateCart when newsletter checkbox is clicked', async () => {
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    const checkbox = screen.getByLabelText('Odber newslettera (zľava 10%)');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    await waitFor(() => {
        expect(mockUpdateCart).toHaveBeenCalledWith({
            cartId: '123',
            discountForNewsletter: true
        });
    });
  });

  test('checkbox reflects cart state', () => {
      useCart.mockReturnValue({
          cart: { ...mockCart, discountForNewsletter: true },
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

      const checkbox = screen.getByLabelText('Odber newslettera (zľava 10%)');
      expect(checkbox).toBeChecked();
  });

  test('displays specific error message when discount code is not found', async () => {
    const error = new Error('Not Found');
    error.status = 404;
    mockAddDiscount.mockRejectedValue(error);

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Vložte kód');
    const button = screen.getByText('Použiť');

    fireEvent.change(input, { target: { value: 'INVALID' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Zľavový kód sa nenašiel.')).toBeInTheDocument();
    });
  });

  test('displays generic error message for other errors', async () => {
    mockAddDiscount.mockRejectedValue(new Error('Generic Error'));

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Vložte kód');
    const button = screen.getByText('Použiť');

    fireEvent.change(input, { target: { value: 'ERROR' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Generic Error')).toBeInTheDocument();
    });
  });
});
