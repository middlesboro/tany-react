import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginModal from './LoginModal';
import { ModalProvider } from '../context/ModalContext';
import * as authService from '../services/authService';

// Mock authService
vi.mock('../services/authService', () => ({
  requestMagicLink: vi.fn(),
}));

describe('LoginModal', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('saves current path to localStorage on submit', async () => {
    const testPath = '/some/protected/route?foo=bar';

    render(
      <MemoryRouter initialEntries={[testPath]}>
        <ModalProvider>
          <LoginModal />
        </ModalProvider>
      </MemoryRouter>
    );

    // Trigger the modal to open via auth_error event
    fireEvent(window, new Event('auth_error'));

    // Check if modal is visible
    expect(await screen.findByText('Prihlásenie')).toBeInTheDocument();

    // Fill in email
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Submit form
    const submitButton = screen.getByText('Odoslať prihlasovací odkaz');
    fireEvent.click(submitButton);

    // Wait for submission logic
    await waitFor(() => {
        expect(authService.requestMagicLink).toHaveBeenCalledWith('test@example.com');
    });

    // Check if localStorage has the redirect path
    expect(localStorage.getItem('post_login_redirect')).toBe(testPath);
  });
});
