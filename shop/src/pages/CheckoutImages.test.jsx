import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

describe('Checkout Component - Images', () => {
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
        { id: 'carrier1', name: 'Carrier 1', price: 5, selected: true, image: 'carrier1.png' },
        { id: 'carrier2', name: 'Carrier 2', price: 10, image: 'carrier2.png' }
    ],
    payments: [
        { id: 'payment1', name: 'Payment 1', price: 0, selected: true, image: 'payment1.png' },
        { id: 'payment2', name: 'Payment 2', price: 2, image: 'payment2.png' }
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

  test('renders carrier images', () => {
    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    const carrier1Image = screen.getByAltText('Carrier 1');
    expect(carrier1Image).toBeInTheDocument();
    expect(carrier1Image).toHaveAttribute('src', 'carrier1.png');
    expect(carrier1Image).toHaveClass('carrier-icon');

    const carrier2Image = screen.getByAltText('Carrier 2');
    expect(carrier2Image).toBeInTheDocument();
    expect(carrier2Image).toHaveAttribute('src', 'carrier2.png');
    expect(carrier2Image).toHaveClass('carrier-icon');
  });

  test('renders payment images when carrier is selected', () => {
    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    const payment1Image = screen.getByAltText('Payment 1');
    expect(payment1Image).toBeInTheDocument();
    expect(payment1Image).toHaveAttribute('src', 'payment1.png');
    expect(payment1Image).toHaveClass('payment-image');

    const payment2Image = screen.getByAltText('Payment 2');
    expect(payment2Image).toBeInTheDocument();
    expect(payment2Image).toHaveAttribute('src', 'payment2.png');
    expect(payment2Image).toHaveClass('payment-image');
  });
});
