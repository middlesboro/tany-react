import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Checkout from './Checkout';
import { useCart } from '../context/CartContext';
import { BrowserRouter } from 'react-router-dom';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  BrowserRouter: ({ children }) => <>{children}</>
}), { virtual: true });

// Mock the CartContext
jest.mock('../context/CartContext', () => ({
  useCart: jest.fn(),
}));

// Mock the BreadcrumbContext
jest.mock('../context/BreadcrumbContext', () => ({
  useBreadcrumbs: () => ({
    setBreadcrumbs: jest.fn(),
  }),
}));

// Mock the debounce function
jest.mock('../utils/debounce', () => ({
  debounce: (func) => {
    func.cancel = jest.fn();
    return func;
  },
}));

// Mock the orderService
jest.mock('../services/orderService', () => ({
  createOrder: jest.fn(),
}));

describe('Checkout Component', () => {
  const mockUpdateCart = jest.fn();
  const mockClearCart = jest.fn();

  const mockCart = {
    cartId: '123',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    invoiceAddress: { street: 'Main St', city: 'City', zip: '12345' },
    deliveryAddress: { street: 'Other St', city: 'City', zip: '12345' },
    selectedCarrierId: 'carrier1',
    selectedPaymentId: 'payment1',
    carriers: [
        { id: 'carrier1', name: 'Carrier 1', price: 5, selected: true },
        { id: 'carrier2', name: 'Carrier 2', price: 10 }
    ],
    payments: [
        { id: 'payment1', name: 'Payment 1', price: 0, selected: true }
    ],
    products: []
  };

  beforeEach(() => {
    mockUpdateCart.mockResolvedValue({}); // Ensure it returns a promise
    useCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      clearCart: mockClearCart,
      updateCart: mockUpdateCart,
    });
    mockUpdateCart.mockClear();
  });

  test('initializes fields from cart', () => {
    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Main St')).toBeInTheDocument();
    expect(screen.getByLabelText('Doručiť na inú adresu')).toBeChecked();
    expect(screen.getByDisplayValue('Other St')).toBeInTheDocument();
  });

  test('calls updateCart when fields change', async () => {
    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    const firstnameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstnameInput, { target: { value: 'Jane' } });

    await waitFor(() => {
        expect(mockUpdateCart).toHaveBeenCalled();
    });

    const lastCall = mockUpdateCart.mock.calls[mockUpdateCart.mock.calls.length - 1][0];
    expect(lastCall.firstname).toBe('Jane');
    expect(lastCall.cartId).toBe('123');
  });

  test('updates carrier immediately', async () => {
      render(
        <BrowserRouter>
          <Checkout />
        </BrowserRouter>
      );

      // In the output HTML, the label text for Carrier 2 includes the price "10.00 €"
      // because they are in the same label structure.
      // Using regex to match partially or strict equality if we know full text.
      // Based on Checkout.js: <div className="font-bold">{carrier.name}</div>
      // Testing Library's getByLabelText matches the input associated with label.
      // The input is inside the label.
      // Text content of label includes "Carrier 2", description, and "10.00 €".

      const carrier2Radio = screen.getByRole('radio', { name: /Carrier 2/i });
      fireEvent.click(carrier2Radio);

      await waitFor(() => {
           const calls = mockUpdateCart.mock.calls;
           const callWithCarrier2 = calls.find(call => call[0].selectedCarrierId === 'carrier2');
           expect(callWithCarrier2).toBeDefined();
      });
  });

  test('preserves discountForNewsletter when updating cart', async () => {
    const cartWithDiscount = { ...mockCart, discountForNewsletter: true };
    useCart.mockReturnValue({
      cart: cartWithDiscount,
      loading: false,
      clearCart: mockClearCart,
      updateCart: mockUpdateCart,
    });

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    // Trigger update
    const firstnameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstnameInput, { target: { value: 'Jane' } });

    await waitFor(() => {
        expect(mockUpdateCart).toHaveBeenCalled();
    });

    const lastCall = mockUpdateCart.mock.calls[mockUpdateCart.mock.calls.length - 1][0];
    expect(lastCall.discountForNewsletter).toBe(true);
  });
});
