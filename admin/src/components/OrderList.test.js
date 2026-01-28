import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderList from './OrderList';
import * as orderAdminService from '../services/orderAdminService';
import * as carrierAdminService from '../services/carrierAdminService';
import * as paymentAdminService from '../services/paymentAdminService';

// Mock the services
jest.mock('../services/orderAdminService');
jest.mock('../services/carrierAdminService');
jest.mock('../services/paymentAdminService');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

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

const mockOrderDetails = {
  id: 100,
  orderIdentifier: 'ORD-2023-100',
  createDate: '2023-01-01',
  statusHistory: [],
  cartId: 'cart-123',
  customerName: 'John Doe',
  status: 'PENDING',
  carrierName: 'DHL',
  paymentName: 'Card',
  finalPrice: 150.0,
  items: [
    { productId: 1, productName: 'Product 1', quantity: 2, price: 50 },
  ],
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
    orderAdminService.getOrder.mockResolvedValue(mockOrderDetails);
    carrierAdminService.getCarriers.mockResolvedValue(mockCarriers);
    paymentAdminService.getPayments.mockResolvedValue(mockPayments);
    localStorage.clear();
    jest.clearAllMocks();
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

    const identifierElement = await screen.findByText('ORD-2023-100');
    expect(identifierElement).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    const editLink = links.find((link) => link.getAttribute('href') === '/orders/100');
    expect(editLink).toBeInTheDocument();
  });

  test('persists filter and sort state to localStorage', async () => {
    render(
      <MemoryRouter>
        <OrderList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(orderAdminService.getOrders).toHaveBeenCalled();
    });

    const statusInput = screen.getByPlaceholderText('Status');
    fireEvent.change(statusInput, { target: { value: 'PAID' } });

    const filterButton = screen.getByText('Filter');
    fireEvent.click(filterButton);

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('admin_orders_list_state'));
      expect(stored).toMatchObject({
        appliedFilter: expect.objectContaining({ status: 'PAID' }),
      });
    });

    // There are multiple "Status" texts (label and table header), so we target the table header specifically
    // Since getByText might return the label too, we can use getAllByText or restrict by selector if supported,
    // but testing-library recommends roles. The header is a 'columnheader' (if th) or just use closest.
    // However, for simplicity here, let's use getAllByText and find the one that is a th, or use getByRole.

    // Using getByRole for the column header
    const statusHeader = screen.getByRole('columnheader', { name: /Status/i });
    fireEvent.click(statusHeader);

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('admin_orders_list_state'));
      expect(stored).toMatchObject({
        sort: 'status,asc',
      });
    });
  });

  test('initializes with state from localStorage', async () => {
    const savedState = {
      page: 1,
      size: 25,
      sort: 'finalPrice,desc',
      appliedFilter: { status: 'DELIVERED' },
    };
    localStorage.setItem('admin_orders_list_state', JSON.stringify(savedState));

    render(
      <MemoryRouter>
        <OrderList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(orderAdminService.getOrders).toHaveBeenCalledWith(
        1,
        'finalPrice,desc',
        25,
        expect.objectContaining({ status: 'DELIVERED' })
      );
    });

    expect(screen.getByPlaceholderText('Status')).toHaveValue('DELIVERED');
  });

  test('handles order duplication correctly', async () => {
    window.confirm = jest.fn().mockImplementation(() => true);

    render(
      <MemoryRouter>
        <OrderList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(orderAdminService.getOrders).toHaveBeenCalled();
    });

    const duplicateButton = screen.getByTitle('Duplicate');
    fireEvent.click(duplicateButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to duplicate this order?');

    await waitFor(() => {
      expect(orderAdminService.getOrder).toHaveBeenCalledWith(100);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/orders/new', {
      state: {
        duplicatedOrder: expect.objectContaining({
          status: 'CREATED',
          cartId: null,
          items: [
             { id: 1, name: 'Product 1', quantity: 2, price: 50, image: undefined }
          ]
        }),
      },
    });
  });
});
