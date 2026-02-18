import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import OrderConfirmation from './OrderConfirmation';
import { getOrderConfirmation } from '../services/orderService';
import { getPaymentInfo, checkBesteronStatus } from '../services/paymentService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import { vi, describe, beforeEach, afterEach, test, expect } from 'vitest';

// Mock react-router-dom
const mockUseSearchParams = vi.fn();
vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: '123' }),
  useLocation: () => ({ state: {} }),
  useSearchParams: () => mockUseSearchParams(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock services
vi.mock('../services/orderService', () => ({
  getOrderConfirmation: vi.fn(),
}));

vi.mock('../services/paymentService', () => ({
  getPaymentInfo: vi.fn(),
  checkBesteronStatus: vi.fn(),
}));

// Mock contexts
vi.mock('../context/BreadcrumbContext', () => ({
  useBreadcrumbs: vi.fn(),
}));

vi.mock('../context/CookieConsentContext', () => ({
  useCookieConsent: () => ({ consent: { marketing: true } }),
}));

// Mock PriceBreakdown implicitly handled or mocked if needed
// OrderConfirmation uses getBreakdownItem which accesses order.priceBreakDown

describe('OrderConfirmation Verifying Payment', () => {
  const mockOrder = {
    id: '123',
    orderIdentifier: '123',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    deliveryAddress: { street: 'Main St', city: 'City', zip: '12345' },
    invoiceAddress: { street: 'Main St', city: 'City', zip: '12345' },
    items: [],
    finalPrice: 100,
    status: 'NEW',
    paymentType: 'GLOBAL_PAYMENTS',
    priceBreakDown: {
        items: [],
        totalPrice: 100,
        totalPriceWithoutVat: 80,
        totalPriceVatValue: 20
    }
  };

  beforeEach(() => {
    useBreadcrumbs.mockReturnValue({ setBreadcrumbs: vi.fn() });
    getOrderConfirmation.mockResolvedValue(mockOrder);
    getPaymentInfo.mockResolvedValue({
        qrCode: 'fake-qr-code',
        paymentLink: 'https://payme.sk/link',
        iban: 'SK1234567890',
        variableSymbol: '123456'
    });
    mockUseSearchParams.mockReturnValue([new URLSearchParams()]);
    checkBesteronStatus.mockResolvedValue({ status: 'PENDING' }); // Keep it pending
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('hides payment section when verifying besteron payment', async () => {
    // Set verifyPayment=besteron in search params
    const searchParams = new URLSearchParams();
    searchParams.set('verifyPayment', 'besteron');
    mockUseSearchParams.mockReturnValue([searchParams]);

    render(<OrderConfirmation />);

    await waitFor(() => {
      expect(screen.getByText('Objednávka #123')).toBeInTheDocument();
    });

    // We expect the verifying message to appear
    await waitFor(() => {
        expect(screen.queryByText(/Spracováva sa/i)).toBeInTheDocument();
    });

    // We expect payment section (title "Platba") to be HIDDEN
    // Currently it is visible, so this expectation should FAIL before the fix
    const paymentSectionTitle = screen.queryByText('Platba');
    expect(paymentSectionTitle).not.toBeInTheDocument();
  });
});
