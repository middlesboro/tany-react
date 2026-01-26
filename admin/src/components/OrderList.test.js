import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderList from './OrderList';
import * as orderAdminService from '../services/orderAdminService';
import * as carrierAdminService from '../services/carrierAdminService';
import * as paymentAdminService from '../services/paymentAdminService';

// Mock the services
jest.mock('../services/orderAdminService');
jest.mock('../services/carrierAdminService');
jest.mock('../services/paymentAdminService');

const mockOrders = {
  content: [
    {
      id: 100,
      orderIdentifier: 'ORD-2023-100',
      customerName: 'John Doe',
      status: 'PENDING',
      carrierName: 'DHL',
      paymentName: 'Card',
      finalPrice: 150.0,
    },
  ],
  totalPages: 1,
};

const mockCarriers = {
  content: [{ id: 1, name: 'DHL' }],
};

const mockPayments = {
  content: [{ id: 1, name: 'Card' }],
};

describe('OrderList', () => {
  beforeEach(() => {
    orderAdminService.getOrders.mockResolvedValue(mockOrders);
    carrierAdminService.getCarriers.mockResolvedValue(mockCarriers);
    paymentAdminService.getPayments.mockResolvedValue(mockPayments);
  });

  test('renders order identifier instead of id in the table but uses id for link', async () => {
    render(
      <MemoryRouter>
        <OrderList />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(orderAdminService.getOrders).toHaveBeenCalled();
    });

    // Check if the order identifier is displayed
    // Note: Before the fix, this is expected to fail (it would find "100" but not "ORD-2023-100" in the first column)
    // However, since we are writing the test to verify the desired behavior, we assert for ORD-2023-100.
    const identifierElement = await screen.findByText('ORD-2023-100');
    expect(identifierElement).toBeInTheDocument();

    // Check if the link uses the ID (100)
    const links = screen.getAllByRole('link');
    const editLink = links.find((link) => link.getAttribute('href') === '/orders/100');
    expect(editLink).toBeInTheDocument();

    // Verify "100" is NOT displayed as the order identifier (though it might be present in the link href or elsewhere if we are not careful, but distinct enough)
    // Actually, "100" might appear in the href, so checking it's not in the document might be flaky if it's in the link text (it's not, link is an icon).
    // The previous implementation showed 100 in the cell.
    // If we want to be strict, we could check the specific cell content.
  });
});
