import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import OrderConfirmation from './OrderConfirmation';
import { getOrderConfirmation, getOrder } from '../services/orderService';
import { getPaymentInfo } from '../services/paymentService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '123' }),
  useLocation: () => ({ state: {} }),
  useSearchParams: () => [new URLSearchParams()],
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock services
jest.mock('../services/orderService', () => ({
  getOrder: jest.fn(),
  getOrderConfirmation: jest.fn(),
}));

jest.mock('../services/paymentService', () => ({
  getPaymentInfo: jest.fn(),
  checkBesteronStatus: jest.fn(),
}));

// Mock contexts
jest.mock('../context/BreadcrumbContext', () => ({
  useBreadcrumbs: jest.fn(),
}));

// Mock components
jest.mock('../components/PriceBreakdown', () => () => <div>PriceBreakdown</div>);

describe('OrderConfirmation', () => {
  const mockOrder = {
    id: '123',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    deliveryAddress: { street: 'Main St', city: 'City', zip: '12345' },
    invoiceAddress: { street: 'Main St', city: 'City', zip: '12345' },
    items: [],
    finalPrice: 100,
    status: 'NEW',
    paymentType: 'CASH_ON_DELIVERY',
  };

  beforeEach(() => {
    useBreadcrumbs.mockReturnValue({ setBreadcrumbs: jest.fn() });
    getOrderConfirmation.mockResolvedValue(mockOrder);
    getPaymentInfo.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('calls getOrderConfirmation with correct ID', async () => {
    render(<OrderConfirmation />);

    await waitFor(() => {
      expect(screen.getByText('Order #123')).toBeInTheDocument();
    });

    expect(getOrderConfirmation).toHaveBeenCalledWith('123');
    expect(getOrder).not.toHaveBeenCalled();
  });
});
