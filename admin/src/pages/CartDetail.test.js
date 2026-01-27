import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CartDetail from './CartDetail';
import * as cartAdminService from '../services/cartAdminService';

// Mock the service
jest.mock('../services/cartAdminService');

const mockCart = {
  cartId: 1,
  customerName: 'Test Customer',
  createDate: '2023-10-27T10:00:00Z',
  updateDate: '2023-10-28T10:00:00Z',
  items: [
    {
      productId: 101,
      title: 'Product 1',
      price: 50,
      quantity: 2,
    },
  ],
};

describe('CartDetail', () => {
  beforeEach(() => {
    cartAdminService.getCartById.mockResolvedValue(mockCart);
    jest.clearAllMocks();
  });

  test('renders cart details with Slovak date format', async () => {
    const toLocaleStringSpy = jest.spyOn(Date.prototype, 'toLocaleString');

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

    // Check if toLocaleString was called with 'sk-SK' twice (createDate and updateDate)
    // It might be called more times if re-renders happen, so at least twice
    expect(toLocaleStringSpy).toHaveBeenCalledWith('sk-SK');
    expect(toLocaleStringSpy.mock.calls.filter(call => call[0] === 'sk-SK').length).toBeGreaterThanOrEqual(2);

    toLocaleStringSpy.mockRestore();
  });
});
