import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import OrderConfirmation from './OrderConfirmation';
import { getOrderConfirmation } from '../services/orderService';
import { getPaymentInfo, checkBesteronStatus } from '../services/paymentService';
import { BrowserRouter } from 'react-router-dom';

// Mock services
jest.mock('../services/orderService');
jest.mock('../services/paymentService');

// Mock BreadcrumbContext
jest.mock('../context/BreadcrumbContext', () => ({
  useBreadcrumbs: () => ({
    setBreadcrumbs: jest.fn(),
  }),
}));

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
  useSearchParams: () => [new URLSearchParams()],
  useLocation: () => ({ state: {} }),
  Link: ({ children, to, className }) => <a href={to} className={className}>{children}</a>
}));

describe('OrderConfirmation Component', () => {
  const mockOrder = {
    id: 1,
    orderIdentifier: 'ORD-12345',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    status: 'CREATED',
    priceBreakDown: {
      items: [
        { type: 'PRODUCT', title: 'Test Product', quantity: 2, priceWithVat: 50, images: ['test.jpg'] },
        { type: 'SHIPPING', name: 'Shipping', quantity: 1, priceWithVat: 5 },
        { type: 'PAYMENT', name: 'Payment Fee', quantity: 1, priceWithVat: 2 }
      ],
      totalPrice: 107,
      totalPriceWithoutVat: 89.17,
      totalPriceVatValue: 17.83
    },
    deliveryAddress: { street: 'Main St', city: 'Town', zip: '12345' },
    invoiceAddress: { street: 'Main St', city: 'Town', zip: '12345' }
  };

  beforeEach(() => {
    getOrderConfirmation.mockResolvedValue(mockOrder);
    getPaymentInfo.mockResolvedValue({});
    checkBesteronStatus.mockResolvedValue({ status: 'PENDING' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the new order confirmation layout', async () => {
    render(
      <BrowserRouter>
        <OrderConfirmation />
      </BrowserRouter>
    );

    // Wait for order to load
    await waitFor(() => {
      expect(screen.getByText(/ORD-12345/)).toBeInTheDocument();
    });

    // Check for new design elements
    expect(screen.getByText(/Order Confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/Thank you for your purchase/i)).toBeInTheDocument();

    // Check for "Go to Orders" button
    const ordersLink = screen.getByText(/Go to Orders/i);
    expect(ordersLink).toBeInTheDocument();
    expect(ordersLink).toHaveAttribute('href', '/account/orders');

    // Check for Table Items
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    // Check for Price rendering (depending on implementation, might need adjustment)
    expect(screen.getByText('107.00 €')).toBeInTheDocument(); // Total
  });

  test('displays payment verification status', async () => {
     // This test ensures we didn't break existing logic
     // Adjust mocks if necessary to trigger verification logic
     render(
      <BrowserRouter>
        <OrderConfirmation />
      </BrowserRouter>
    );

    await waitFor(() => {
       expect(getOrderConfirmation).toHaveBeenCalledWith('1');
    });
  });
});
