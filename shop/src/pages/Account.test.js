import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Account from './Account';
import { getCustomer, updateCustomer } from '../services/customerService';
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

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

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

  test('renders profile tab by default and loads customer data', async () => {
    render(<Account />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Môj účet')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByText('Osobné údaje', { selector: 'button' })).toHaveClass('text-tany-green');
    expect(getCustomer).toHaveBeenCalledTimes(1);
  });

  test('switches to wishlist tab and fetches data', async () => {
    // Mock wishlist data
    const mockWishlistProducts = [
      { id: '1', title: 'Product 1' },
      { id: '2', title: 'Product 2' }
    ];
    getWishlist.mockResolvedValue({ content: mockWishlistProducts });

    render(<Account />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const wishlistTab = screen.getByText('Obľúbené produkty');
    fireEvent.click(wishlistTab);

    // Check if loading state appears or handled (it might be fast)
    // We expect getWishlist to be called
    expect(getWishlist).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(2);
    });

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  test('logout button calls removeToken and navigates', async () => {
    render(<Account />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const logoutBtn = screen.getByText('Odhlásiť sa');
    fireEvent.click(logoutBtn);

    expect(removeToken).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
