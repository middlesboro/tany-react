import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CustomerOrderList from './CustomerOrderList';
import * as orderService from '../services/orderService';

jest.mock('../services/orderService');

const mockOrders = [
  {
    id: 1,
    orderIdentifier: 'ORD-123',
    createDate: '2023-01-01T12:00:00Z',
    status: 'NEW',
    finalPrice: 10.50,
  },
  {
    id: 2,
    orderIdentifier: 'ORD-456',
    createDate: '2023-02-01T12:00:00Z',
    status: 'SHIPPED',
    finalPrice: 100.00,
  }
];

describe('CustomerOrderList Component', () => {
  beforeEach(() => {
    orderService.getOrders.mockResolvedValue({
      content: mockOrders,
      totalPages: 1
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders order list with correct prices and classes', async () => {
    const handleOrderSelect = jest.fn();
    render(<CustomerOrderList onOrderSelect={handleOrderSelect} />);

    // Wait for loading to finish
    await waitFor(() => {
        expect(screen.getByText('ORD-123')).toBeInTheDocument();
    });

    // Check if prices are rendered
    const price1 = screen.getByText('10.50 €');
    expect(price1).toBeInTheDocument();
    expect(price1).toHaveClass('whitespace-nowrap');

    const price2 = screen.getByText('100.00 €');
    expect(price2).toBeInTheDocument();
    expect(price2).toHaveClass('whitespace-nowrap');
  });

  test('displays loading state initially', () => {
     // Mock a never resolving promise to keep it loading, or just check immediately
     orderService.getOrders.mockImplementation(() => new Promise(() => {}));
     render(<CustomerOrderList onOrderSelect={() => {}} />);
     expect(screen.getByText('Načítavam objednávky...')).toBeInTheDocument();
  });
});
