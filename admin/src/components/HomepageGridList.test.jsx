import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import HomepageGridList from './HomepageGridList';
import * as service from '../services/homepageGridAdminService';

// Mock the service
vi.mock('../services/homepageGridAdminService', () => ({
  getHomepageGrids: vi.fn(),
  deleteHomepageGrid: vi.fn(),
  updateHomepageGridOrder: vi.fn(),
}));

// Mock usePersistentTableState to avoid local storage issues and control state
vi.mock('../hooks/usePersistentTableState', () => ({
  default: () => ({
    page: 0,
    setPage: vi.fn(),
    size: 20,
    setSize: vi.fn(),
    sort: 'order,asc',
    handleSort: vi.fn(),
  }),
}));

const mockGrids = {
  content: [
    { id: 1, title: 'Grid 1', resultCount: 10, order: 1, sortField: 'title', sortOrder: 'asc' },
    { id: 2, title: 'Grid 2', resultCount: 5, order: 2, sortField: 'title', sortOrder: 'asc' },
  ],
  totalPages: 1,
};

describe('HomepageGridList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    service.getHomepageGrids.mockResolvedValue(mockGrids);
    service.updateHomepageGridOrder.mockResolvedValue({});
  });

  it('renders grid list with order column', async () => {
    render(
      <BrowserRouter>
        <HomepageGridList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Grid 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Order')).toBeInTheDocument();
    // Check for order values. Note: "1" might appear in pagination, so we look for specific cell or context if possible.
    // For simplicity, just checking existence.
    expect(screen.getByText('Grid 2')).toBeInTheDocument();
  });

  it('calls updateHomepageGridOrder on drop', async () => {
    render(
      <BrowserRouter>
        <HomepageGridList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Grid 1')).toBeInTheDocument();
    });

    const rows = screen.getAllByRole('row');
    // rows[0] is header, rows[1] is Grid 1, rows[2] is Grid 2
    const row1 = rows[1];
    const row2 = rows[2];

    // Mock dataTransfer
    const dataTransfer = {
      setData: vi.fn(),
      getData: vi.fn(() => JSON.stringify({ id: 1, order: 1 })),
    };

    // Drag start
    fireEvent.dragStart(row1, { dataTransfer });
    expect(dataTransfer.setData).toHaveBeenCalledWith('application/json', JSON.stringify({ id: 1, order: 1 }));

    // Drop on row 2
    fireEvent.drop(row2, { dataTransfer });

    await waitFor(() => {
      expect(service.updateHomepageGridOrder).toHaveBeenCalledWith(1, 2);
    });
    // Should refresh grids
    await waitFor(() => {
      expect(service.getHomepageGrids).toHaveBeenCalledTimes(2); // Initial + Refresh
    });
  });
});
