import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Account from './Account';
import { getCustomer } from '../services/customerService';
import { getWishlist } from '../services/wishlistService';
import { removeToken } from '../services/authService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

// Mocks
jest.mock('../services/customerService');
jest.mock('../services/wishlistService');
jest.mock('../services/authService');
jest.mock('../context/BreadcrumbContext');

// Mock ProductCard to avoid complex context dependencies
jest.mock('../components/ProductCard', () => ({ product }) => (
  <div data-testid="product-card">{product.title}</div>
));

describe('Account Page', () => {
  const mockSetBreadcrumbs = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useBreadcrumbs.mockReturnValue({ setBreadcrumbs: mockSetBreadcrumbs });

    // Default customer mock
    getCustomer.mockResolvedValue({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      invoiceAddress: {},
      deliveryAddress: {}
    });
  });

  const renderWithRouter = (initialEntry = '/account/personal-data') => {
    return render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/account/:tab" element={<Account />} />
          <Route path="/account/orders/:orderId" element={<Account />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders profile tab by default and loads customer data', async () => {
    renderWithRouter('/account/personal-data');

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Môj účet')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByText('Osobné údaje', { selector: 'button' })).toHaveClass('text-tany-green');
    expect(getCustomer).toHaveBeenCalledTimes(1);
  });

  test('loading wishlist data when navigating to wishlist tab', async () => {
    const mockWishlistProducts = [
      { id: '1', title: 'Product 1' },
      { id: '2', title: 'Product 2' }
    ];
    getWishlist.mockResolvedValue({ content: mockWishlistProducts });

    renderWithRouter('/account/wishlist');

    await waitFor(() => {
        expect(getWishlist).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(2);
    });

    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });

  test('switches to wishlist tab when clicking button', async () => {
    const mockWishlistProducts = [];
    getWishlist.mockResolvedValue({ content: mockWishlistProducts });

    renderWithRouter('/account/personal-data');

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const wishlistTab = screen.getByText('Obľúbené produkty');
    fireEvent.click(wishlistTab);

    // Navigation should trigger data fetch
    await waitFor(() => {
        expect(getWishlist).toHaveBeenCalledTimes(1);
    });
  });

  test('logout button calls removeToken and navigates home', async () => {
    renderWithRouter('/account/personal-data');

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const logoutBtn = screen.getByText('Odhlásiť sa');
    fireEvent.click(logoutBtn);

    expect(removeToken).toHaveBeenCalledTimes(1);
    await waitFor(() => {
        expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
  });
});
