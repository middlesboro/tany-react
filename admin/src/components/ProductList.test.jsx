import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import ProductList from './ProductList';
import * as productAdminService from '../services/productAdminService';
import * as brandAdminService from '../services/brandAdminService';

// Mock the services
vi.mock('../services/productAdminService');
vi.mock('../services/brandAdminService');

// Mock SearchSelect
vi.mock('./SearchSelect', () => ({
  default: ({ value, onChange }) => (
    <input data-testid="brand-select" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ProductList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    productAdminService.getAdminProducts.mockResolvedValue({
      content: [
        { id: 'uuid-1', productIdentifier: 101, title: 'Product 1', price: 100, quantity: 10, brandId: 'brand-1', active: true }
      ],
      totalPages: 1
    });
    brandAdminService.getBrands.mockResolvedValue({
      content: [{ id: 'brand-1', name: 'Brand A' }]
    });
  });

  test('renders Id column and data', async () => {
    renderWithRouter(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    // Check for new column header "Id"
    const headers = screen.getAllByRole('columnheader');
    const idHeader = headers.find(h => h.textContent.includes('Id'));
    expect(idHeader).toBeInTheDocument();

    // Check for data
    expect(screen.getByText('101')).toBeInTheDocument();
  });

  test('filters by productIdentifier', async () => {
    renderWithRouter(<ProductList />);

    await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    // Use placeholder text as label association is not standard in this component
    const idInput = screen.getByPlaceholderText('Product ID');
    fireEvent.change(idInput, { target: { value: '101' } });
    fireEvent.keyDown(idInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(productAdminService.getAdminProducts).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ productIdentifier: '101' })
      );
    });
  });

  test('sorts by productIdentifier', async () => {
    renderWithRouter(<ProductList />);

    await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    const headers = screen.getAllByRole('columnheader');
    const idHeader = headers.find(h => h.textContent.includes('Id'));
    fireEvent.click(idHeader);

    await waitFor(() => {
      expect(productAdminService.getAdminProducts).toHaveBeenCalledWith(
        expect.anything(),
        'productIdentifier,asc',
        expect.anything(),
        expect.anything()
      );
    });
  });
});
