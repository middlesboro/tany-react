import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CartList from './CartList';
import * as cartAdminService from '../services/cartAdminService';

// Mock the service
jest.mock('../services/cartAdminService');

const mockCarts = {
  content: [
    {
      cartId: 1,
      orderIdentifier: null,
      customerName: 'Test Customer',
      price: 100,
      carrierName: 'DHL',
      paymentName: 'Card',
      createDate: '2023-10-27T10:00:00Z',
    },
  ],
  totalPages: 1,
};

describe('CartList', () => {
  beforeEach(() => {
    cartAdminService.getCarts.mockResolvedValue(mockCarts);
    jest.clearAllMocks();
  });

  test('calls getCarts with default sort by createDate,desc', async () => {
    render(
      <MemoryRouter>
        <CartList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(cartAdminService.getCarts).toHaveBeenCalledWith(
        0, // page
        'createDate,desc', // sort
        10, // size
        expect.anything()
      );
    });
  });

  test('renders cart date using Slovak locale', async () => {
    // Spy on Date.prototype.toLocaleString to ensure it's called with 'sk-SK'
    const toLocaleStringSpy = jest.spyOn(Date.prototype, 'toLocaleString');

    render(
      <MemoryRouter>
        <CartList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(cartAdminService.getCarts).toHaveBeenCalled();
    });

    // Wait for the customer name to appear, which means the table body is rendered
    await screen.findByText('Test Customer');

    // Check if the spy was called with 'sk-SK'
    expect(toLocaleStringSpy).toHaveBeenCalledWith('sk-SK');

    toLocaleStringSpy.mockRestore();
  });
});
