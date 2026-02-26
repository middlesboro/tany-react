import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CustomerMessageList from './CustomerMessageList';
import * as service from '../services/customerMessageService';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../services/customerMessageService');
// Mock the usePersistentTableState hook to avoid issues with localStorage/state
vi.mock('../hooks/usePersistentTableState', () => ({
  default: () => ({
    page: 0,
    setPage: vi.fn(),
    size: 20,
    setSize: vi.fn(),
    sort: 'createDate,desc',
    handleSort: vi.fn()
  })
}));


const mockMessages = {
  content: [
    {
      id: '1',
      message: 'Hello world',
      email: 'test@example.com',
      createDate: '2023-10-27T10:00:00Z'
    }
  ],
  totalPages: 1
};

describe('CustomerMessageList', () => {
  it('renders messages', async () => {
    service.getCustomerMessages.mockResolvedValue(mockMessages);

    render(
      <BrowserRouter>
        <CustomerMessageList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Hello world')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });
});
