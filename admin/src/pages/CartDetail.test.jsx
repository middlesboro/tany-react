import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CartDetail from './CartDetail';
import * as cartAdminService from '../services/cartAdminService';

// Mock the service
vi.mock('../services/cartAdminService');

const mockCart = {
  cartId: 1,
  customerName: 'Test Customer',
  carrierName: 'Test Carrier',
  paymentName: 'Test Payment',
  orderIdentifier: 12345,
  createDate: '2023-10-27T10:00:00Z',
  updateDate: '2023-10-28T10:00:00Z',
  priceBreakDown: {
    items: [
      {
        type: 'PRODUCT',
        name: 'Product 1',
        priceWithVat: 50,
        quantity: 2,
        image: null
      }
    ],
    totalPrice: 100,
    totalPriceWithoutVat: 80,
    totalPriceVatValue: 20
  }
};

describe('CartDetail', () => {
  beforeEach(() => {
    cartAdminService.getCartById.mockResolvedValue(mockCart);
    vi.clearAllMocks();
  });

  test('renders cart details with Slovak date format and new fields', async () => {
    const toLocaleStringSpy = vi.spyOn(Date.prototype, 'toLocaleString');

    render(
      <MemoryRouter initialEntries={['/carts/1']}>
        <Routes>
          <Route path="/carts/:id" element={<CartDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(cartAdminService.getCartById).toHaveBeenCalledWith('1');
    });

    await screen.findByText('Test Customer');
    await screen.findByText('Test Carrier');
    await screen.findByText('Test Payment');
    await screen.findByText('12345');

    // Check price breakdown
    await screen.findByText('Product 1');
    await screen.findByText(/Objednané:\s+2\s+ks/);
    // We check for total price formatted. PriceBreakdown displays "100.00 €"
    const prices = await screen.findAllByText('100.00 €');
    expect(prices.length).toBeGreaterThanOrEqual(1);

    // Check if toLocaleString was called with 'sk-SK' twice (createDate and updateDate)
    expect(toLocaleStringSpy).toHaveBeenCalledWith('sk-SK');
    expect(toLocaleStringSpy.mock.calls.filter(call => call[0] === 'sk-SK').length).toBeGreaterThanOrEqual(2);

    toLocaleStringSpy.mockRestore();
  });
});
