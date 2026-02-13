import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminLayout from './AdminLayout';
import { BrowserRouter } from 'react-router-dom';
import * as authService from '../services/authService';

vi.mock('../services/authService');

// Mock hooks from react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  };
});

describe('AdminLayout', () => {
  beforeEach(() => {
    authService.isAuthenticated.mockReturnValue(true);
    authService.getUserEmail.mockReturnValue('test@example.com');
    localStorage.clear();
  });

  test('renders sidebar and toggles pin state', () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    );

    // Initial state: Pinned (default)
    expect(screen.getByText('Admin')).toBeInTheDocument();

    // Find the toggle button. It has a title "Unpin sidebar" when pinned.
    const toggleButton = screen.getByTitle('Unpin sidebar');
    expect(toggleButton).toBeInTheDocument();

    // Click to unpin
    fireEvent.click(toggleButton);

    // State should be unpinned.
    // The button title should change to "Pin sidebar".
    const pinButton = screen.getByTitle('Pin sidebar');
    expect(pinButton).toBeInTheDocument();

    // Verify localStorage
    expect(localStorage.getItem('admin_sidebar_pinned')).toBe('false');

    // Click to pin again
    fireEvent.click(pinButton);
    expect(screen.getByTitle('Unpin sidebar')).toBeInTheDocument();
    expect(localStorage.getItem('admin_sidebar_pinned')).toBe('true');
  });

  test('initializes from localStorage', () => {
    localStorage.setItem('admin_sidebar_pinned', 'false');
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    );
    expect(screen.getByTitle('Pin sidebar')).toBeInTheDocument();
  });
});
