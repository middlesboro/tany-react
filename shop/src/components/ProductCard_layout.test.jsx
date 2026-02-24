/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

// Mock AddToCartButton to capture clicks and check DOM presence
vi.mock('./AddToCartButton', () => ({
  default: ({ onClick, disabled, text }) => (
    <button data-testid="add-to-cart-btn" onClick={onClick} disabled={disabled}>{text}</button>
  )
}));

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 10.0,
  quantity: 5, // This is quantity in stock
  images: ['image1.jpg'],
  productLabels: [],
  inWishlist: false,
  slug: 'test-product'
};

test('does not render quantity input', () => {
  useCart.mockReturnValue({ addToCart: vi.fn(), cart: { products: [] } });
  useModal.mockReturnValue({ openLoginModal: vi.fn() });

  render(
    <BrowserRouter>
      <ProductCard product={mockProduct} />
    </BrowserRouter>
  );

  const input = screen.queryByRole('spinbutton'); // number input
  expect(input).not.toBeInTheDocument();
});

test('add to cart button adds 1 item', async () => {
  const addToCartMock = vi.fn();
  useCart.mockReturnValue({ addToCart: addToCartMock, cart: { products: [] } });
  useModal.mockReturnValue({ openLoginModal: vi.fn() });

  render(
    <BrowserRouter>
      <ProductCard product={mockProduct} />
    </BrowserRouter>
  );

  const btn = screen.getByTestId('add-to-cart-btn');
  fireEvent.click(btn);

  expect(addToCartMock).toHaveBeenCalledWith(mockProduct.id, 1);
});

test('mobile wishlist button is before add to cart button', () => {
  useCart.mockReturnValue({ addToCart: vi.fn(), cart: { products: [] } });
  useModal.mockReturnValue({ openLoginModal: vi.fn() });

  render(
    <BrowserRouter>
      <ProductCard product={mockProduct} showWishlist={true} />
    </BrowserRouter>
  );

  const wishlistButtons = screen.getAllByTitle('Pridať do obľúbených');
  // Find the mobile one (not absolute positioned)
  const mobileButton = wishlistButtons.find(btn => !btn.classList.contains('absolute'));

  const addToCartBtn = screen.getByTestId('add-to-cart-btn');

  // Verify they are rendered
  expect(mobileButton).toBeInTheDocument();
  expect(addToCartBtn).toBeInTheDocument();

  // Verify order: mobileButton should be immediately before addToCartBtn
  // Or at least they are siblings in that order.
  // Since AddToCartButton renders a <button>, and mobileButton is a <button>, and they are in the same parent.
  expect(mobileButton.nextElementSibling).toBe(addToCartBtn);
});
