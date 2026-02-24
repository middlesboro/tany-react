import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import { getCategories } from '../services/categoryService';
import { getBlogs } from '../services/blogService';
import { getUserEmail } from '../services/authService';
import { vi } from 'vitest';

// Mocks
vi.mock('../context/CartContext');
vi.mock('../context/ModalContext');
vi.mock('../services/categoryService');
vi.mock('../services/blogService');
vi.mock('../services/authService');
vi.mock('./ProductSearch', () => ({ default: () => <div data-testid="product-search" /> }));
vi.mock('./CategoryTree', () => ({ default: () => <div data-testid="category-tree" /> }));
vi.mock('./BlogSlider', () => ({ default: () => <div data-testid="blog-slider" /> }));
vi.mock('./Breadcrumbs', () => ({ default: () => <div data-testid="breadcrumbs" /> }));

// Setup mocks
useCart.mockReturnValue({ cart: {}, customer: {} });
useModal.mockReturnValue({ openLoginModal: vi.fn() });
getCategories.mockResolvedValue([
  { title: 'Category 1', slug: 'cat-1' },
  { title: 'Category 2', slug: 'cat-2' }
]);
getBlogs.mockResolvedValue([]);
getUserEmail.mockReturnValue(null);

describe('PublicLayout Mobile Menu', () => {
  test('opens mobile menu with scrollable container', async () => {
    render(
      <BrowserRouter>
        <PublicLayout />
      </BrowserRouter>
    );

    // Find and click the menu button
    const menuButton = screen.getByText('Menu');
    fireEvent.click(menuButton);

    // Check if menu is open and has categories
    const categoryLink = await screen.findByText('Category 1');
    expect(categoryLink).toBeInTheDocument();

    // Check for scroll classes on the container
    // The container is the parent of the ul that contains the link.
    // The structure is <div><ul><li><a /></li></ul></div>
    const linkElement = screen.getByText('Category 1');
    const liElement = linkElement.closest('li');
    const ulElement = liElement.parentElement;
    const menuContainer = ulElement.parentElement;

    expect(menuContainer).toHaveClass('max-h-[calc(100vh-64px)]');
    expect(menuContainer).toHaveClass('overflow-y-auto');
  });
});
