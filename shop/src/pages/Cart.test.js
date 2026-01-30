import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Cart from './Cart';
import { useCart } from '../context/CartContext';
import { BrowserRouter } from 'react-router-dom';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Mock the CartContext
jest.mock('../context/CartContext', () => ({
  useCart: jest.fn(),
}));

// Mock the ModalContext
jest.mock('../context/ModalContext', () => ({
  useModal: () => ({
    openMessageModal: jest.fn(),
  }),
}));

// Mock the BreadcrumbContext
jest.mock('../context/BreadcrumbContext', () => ({
  useBreadcrumbs: () => ({
    setBreadcrumbs: jest.fn(),
  }),
}));

describe('Cart Component', () => {
  const mockUpdateCart = jest.fn();
  const mockAddDiscount = jest.fn();
  const mockRemoveDiscount = jest.fn();

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
