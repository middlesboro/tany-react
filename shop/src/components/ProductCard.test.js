import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';
import { BrowserRouter } from 'react-router-dom';

// Mock hooks
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';

jest.mock('../context/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('../context/ModalContext', () => ({
  useModal: jest.fn(),
}));

// Mock services
jest.mock('../services/wishlistService', () => ({
  addToWishlist: jest.fn(),
  removeFromWishlist: jest.fn(),
}));

jest.mock('../services/authService', () => ({
  isAuthenticated: jest.fn().mockReturnValue(true),
}));

// Mock ProductLabel to avoid rendering issues or dependencies
jest.mock('./ProductLabel', () => () => <div data-testid="product-label">Label</div>);

// Mock AddToCartButton
jest.mock('./AddToCartButton', () => ({ onClick, disabled, text }) => (
  <button onClick={onClick} disabled={disabled}>{text}</button>
));

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 10.0,
  quantity: 5,
  images: ['image1.jpg'],
  productLabels: [],
  inWishlist: false,
};

test('renders wishlist button with left-2 class', () => {
  useCart.mockReturnValue({ addToCart: jest.fn(), cart: { products: [] } });
  useModal.mockReturnValue({ openLoginModal: jest.fn() });

  render(
    <BrowserRouter>
      <ProductCard product={mockProduct} />
    </BrowserRouter>
  );

  // Find the wishlist button by its title
  const wishlistButton = screen.getByTitle('Pridať do obľúbených');
  expect(wishlistButton).toBeInTheDocument();
  expect(wishlistButton).toHaveClass('absolute');
  expect(wishlistButton).toHaveClass('top-2');
  expect(wishlistButton).toHaveClass('left-2');
});
