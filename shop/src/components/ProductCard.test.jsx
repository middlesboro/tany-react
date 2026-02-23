/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import ProductCard from './ProductCard';
import { BrowserRouter } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';

// Mock hooks
vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(),
}));

vi.mock('../context/ModalContext', () => ({
  useModal: vi.fn(),
}));

// Mock services
vi.mock('../services/wishlistService', () => ({
  addToWishlist: vi.fn(),
  removeFromWishlist: vi.fn(),
}));

vi.mock('../services/authService', () => ({
  isAuthenticated: vi.fn().mockReturnValue(true),
}));

// Mock ProductLabel to avoid rendering issues or dependencies
vi.mock('./ProductLabel', () => ({
  default: () => <div data-testid="product-label">Label</div>
}));

// Mock AddToCartButton
vi.mock('./AddToCartButton', () => ({
  default: ({ onClick, disabled, text }) => (
    <button onClick={onClick} disabled={disabled}>{text}</button>
  )
}));

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 10.0,
  quantity: 5,
  images: ['image1.jpg'],
  productLabels: [],
  inWishlist: false,
};

test('renders wishlist buttons correctly for mobile and desktop', () => {
  useCart.mockReturnValue({ addToCart: vi.fn(), cart: { products: [] } });
  useModal.mockReturnValue({ openLoginModal: vi.fn() });

  render(
    <BrowserRouter>
      <ProductCard product={mockProduct} />
    </BrowserRouter>
  );

  // Find all wishlist buttons by title
  const wishlistButtons = screen.getAllByTitle('Pridať do obľúbených');
  expect(wishlistButtons).toHaveLength(2);

  // Identify them by class
  const desktopButton = wishlistButtons.find(btn => btn.classList.contains('absolute'));
  const mobileButton = wishlistButtons.find(btn => !btn.classList.contains('absolute'));

  // Desktop checks
  expect(desktopButton).toBeInTheDocument();
  expect(desktopButton).toHaveClass('top-2');
  expect(desktopButton).toHaveClass('left-2');
  expect(desktopButton).toHaveClass('hidden');
  expect(desktopButton).toHaveClass('md:block');

  // Mobile checks
  expect(mobileButton).toBeInTheDocument();
  expect(mobileButton).toHaveClass('md:hidden');
  expect(mobileButton).toHaveClass('p-2');
  // Should verify it is in the flex container? Hard to test structure with just class checks,
  // but we know it's not absolute.
});

test('does not render wishlist buttons when showWishlist is false', () => {
  useCart.mockReturnValue({ addToCart: vi.fn(), cart: { products: [] } });
  useModal.mockReturnValue({ openLoginModal: vi.fn() });

  render(
    <BrowserRouter>
      <ProductCard product={mockProduct} showWishlist={false} />
    </BrowserRouter>
  );

  const wishlistButtons = screen.queryAllByTitle('Pridať do obľúbených');
  expect(wishlistButtons).toHaveLength(0);
});
