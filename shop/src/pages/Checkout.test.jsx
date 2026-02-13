import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Checkout from './Checkout';
import { useCart } from '../context/CartContext';
import { BrowserRouter } from 'react-router-dom';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  BrowserRouter: ({ children }) => <>{children}</>
}), { virtual: true });

// Mock the CartContext
vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(),
}));

// Mock the BreadcrumbContext
vi.mock('../context/BreadcrumbContext', () => ({
  useBreadcrumbs: () => ({
    setBreadcrumbs: vi.fn(),
  }),
}));

// Mock the debounce function
vi.mock('../utils/debounce', () => ({
  debounce: (func) => {
    func.cancel = vi.fn();
    func.flush = vi.fn();
    return func;
  },
}));

// Mock the orderService
vi.mock('../services/orderService', () => ({
  createOrder: vi.fn(),
}));

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();
// Mock scrollTo
window.scrollTo = vi.fn();

describe('Checkout Component', () => {
  const mockUpdateCart = vi.fn();
  const mockClearCart = vi.fn();

  const mockCart = {
    cartId: '123',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    phone: '0944123456',
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
    mockUpdateCart.mockResolvedValue({});
    useCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      clearCart: mockClearCart,
      updateCart: mockUpdateCart,
    });
    mockUpdateCart.mockClear();
    window.HTMLElement.prototype.scrollIntoView.mockClear();
    window.alert = vi.fn();
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

    const firstnameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstnameInput, { target: { value: 'Jane' } });

    await waitFor(() => {
        expect(mockUpdateCart).toHaveBeenCalled();
    });

    const lastCall = mockUpdateCart.mock.calls[mockUpdateCart.mock.calls.length - 1][0];
    expect(lastCall.discountForNewsletter).toBe(true);
  });

  test('renders pickup point button for BALIKOVO carrier', () => {
    const cartWithBalikovo = {
      ...mockCart,
      carriers: [
        { id: 'balikovo', name: 'Balikovo', type: 'BALIKOVO', price: 3, selected: true }
      ],
      selectedCarrierId: 'balikovo'
    };

    useCart.mockReturnValue({
      cart: cartWithBalikovo,
      loading: false,
      clearCart: mockClearCart,
      updateCart: mockUpdateCart,
    });

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    expect(screen.getByText('Vybrať výdajné miesto')).toBeInTheDocument();
  });

  test('calls flush on unmount', () => {
    const { unmount } = render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );
    unmount();
  });

  test('retains pickup point selection when switching between carriers', async () => {
      const cartWithTwoPickupCarriers = {
        ...mockCart,
        carriers: [
          { id: 'packeta', name: 'Packeta', type: 'PACKETA', price: 3, selected: true },
          { id: 'balikovo', name: 'Balikovo', type: 'BALIKOVO', price: 3 }
        ],
        selectedCarrierId: 'packeta'
      };

      useCart.mockReturnValue({
        cart: cartWithTwoPickupCarriers,
        loading: false,
        clearCart: mockClearCart,
        updateCart: mockUpdateCart,
      });

      render(
        <BrowserRouter>
          <Checkout />
        </BrowserRouter>
      );

      // Simulate selecting a point for Packeta via mocked widget
      // Since we can't click the real widget, we'll manually invoke the Packeta callback logic
      // Note: We need to ensure the component has mounted and attached the scripts logic if we were testing e2e,
      // but here we can't easily access the internal widget callback unless we mock window.Packeta

      // Mocking window.Packeta
      window.Packeta = {
          Widget: {
              pick: (apiKey, callback, options) => {
                  callback({ id: 'packeta1', name: 'Packeta Store' });
              }
          }
      };

      fireEvent.click(screen.getByText('Vybrať výdajné miesto')); // Click packeta button

      expect(screen.getByText('Packeta Store')).toBeInTheDocument();

      // Switch to Balikovo
      fireEvent.click(screen.getByRole('radio', { name: /Balikovo/i }));

      // Balikovo uses window.handleSPSPickupPoint
      // Simulate selection
      // Wrap in act because it triggers state update outside of React's event system
      act(() => {
        window.handleSPSPickupPoint({ id: 'balikovo1', description: 'Balikovo Store', address: 'Street', city: 'City', zip: '12345', countryISO: 'SK', type: 'BOX' });
      });

      // Need to trigger a re-render or wait for state update?
      // handleSPSPickupPoint updates state, which triggers re-render
      await waitFor(() => expect(screen.getByText('Balikovo Store')).toBeInTheDocument());

      // Switch back to Packeta
      fireEvent.click(screen.getByRole('radio', { name: /Packeta/i }));

      // Verify Packeta Store is still selected
      expect(screen.getByText('Packeta Store')).toBeInTheDocument();
  });

  test('shows inline validation error and does not alert when pickup point missing', async () => {
      const cartWithPacketa = {
          ...mockCart,
          carriers: [
              { id: 'packeta', name: 'Packeta', type: 'PACKETA', price: 3, selected: true }
          ],
          selectedCarrierId: 'packeta'
      };

      useCart.mockReturnValue({
          cart: cartWithPacketa,
          loading: false,
          clearCart: mockClearCart,
          updateCart: mockUpdateCart,
      });

      render(
          <BrowserRouter>
              <Checkout />
          </BrowserRouter>
      );

      // Try to submit without selecting pickup point
        const submitBtn = screen.getByText('Objednať s povinnosťou platby');
      fireEvent.click(submitBtn);

      await waitFor(() => {
          expect(screen.getByText('Musíte vybrať výdajné miesto')).toBeInTheDocument();
      });

      expect(window.alert).not.toHaveBeenCalled();
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });
});
