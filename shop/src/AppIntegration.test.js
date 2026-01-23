import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as customerService from './services/customerService';
import * as categoryService from './services/categoryService';
import * as blogService from './services/blogService';
import * as productService from './services/productService';

// Mock services
jest.mock('./services/customerService');
jest.mock('./services/categoryService');
jest.mock('./services/blogService');
jest.mock('./services/productService');

// Mock matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock ScrollToTop (it uses window.scrollTo)
jest.mock('./components/ScrollToTop', () => () => null);

describe('App Integration', () => {
  beforeEach(() => {
    customerService.getCustomerContext.mockResolvedValue({ cartDto: {}, customerDto: null });
    categoryService.getCategories.mockResolvedValue([]);
    blogService.getBlogs.mockResolvedValue([]);
    productService.getProducts.mockResolvedValue({ content: [], totalPages: 0 });
  });

  test('renders App and Login button', async () => {
    // Suppress console.error for "ReactDOM.render is no longer supported" warning if react 18
    // But package.json says react 19.

    render(<App />);

    // Wait for basic rendering
    await waitFor(() => {
      // "Prihlásenie" should be visible in the header (if not logged in)
      const loginElements = screen.getAllByText(/Prihlásenie/i);
      expect(loginElements.length).toBeGreaterThan(0);
    });
  });
});
