import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { LegacyContentRedirect, LegacyProductRedirect, BlogLegacyWrapper } from './components/LegacyRedirects';
import NotFound from './pages/NotFound';

// Mock NotFound to make assertions easier
vi.mock('./pages/NotFound', () => ({
  default: () => <div data-testid="not-found">Not Found</div>
}));

// Helper component to display current location
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

describe('Legacy Redirects', () => {
  describe('LegacyContentRedirect', () => {
    it('redirects /content/123-my-page to /my-page', () => {
      render(
        <MemoryRouter initialEntries={['/content/123-my-page']}>
          <Routes>
            <Route path="/content/:idSlug" element={<LegacyContentRedirect />} />
            <Route path="/:slug" element={<LocationDisplay />} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByTestId('location')).toHaveTextContent('/my-page');
    });

    it('renders NotFound for invalid format', () => {
      render(
        <MemoryRouter initialEntries={['/content/invalid-page']}>
          <Routes>
            <Route path="/content/:idSlug" element={<LegacyContentRedirect />} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });
  });

  describe('LegacyProductRedirect', () => {
    it('redirects /category/999-product.html to /produkt/product', () => {
      render(
        <MemoryRouter initialEntries={['/elektronika/999-iphone-15.html']}>
          <Routes>
            <Route path="/:categorySlug/:productSlug" element={<LegacyProductRedirect />} />
            <Route path="/produkt/:slug" element={<LocationDisplay />} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByTestId('location')).toHaveTextContent('/produkt/iphone-15');
    });

    it('redirects /category/999-product-ean.html to /produkt/product (strips EAN)', () => {
      render(
        <MemoryRouter initialEntries={['/elektronika/999-iphone-15-8588006069075.html']}>
          <Routes>
            <Route path="/:categorySlug/:productSlug" element={<LegacyProductRedirect />} />
            <Route path="/produkt/:slug" element={<LocationDisplay />} />
          </Routes>
        </MemoryRouter>
      );
      // EAN (13 digits) should be stripped, keeping "iphone-15"
      expect(screen.getByTestId('location')).toHaveTextContent('/produkt/iphone-15');
    });

    it('does NOT strip short numbers (like model versions)', () => {
      render(
        <MemoryRouter initialEntries={['/elektronika/999-iphone-1234567.html']}>
          <Routes>
            <Route path="/:categorySlug/:productSlug" element={<LegacyProductRedirect />} />
            <Route path="/produkt/:slug" element={<LocationDisplay />} />
          </Routes>
        </MemoryRouter>
      );
      // "1234567" is 7 digits, less than 8, so it is treated as part of the slug
      expect(screen.getByTestId('location')).toHaveTextContent('/produkt/iphone-1234567');
    });

    it('renders NotFound for non-legacy 2-segment URL', () => {
      render(
        <MemoryRouter initialEntries={['/about/team']}>
          <Routes>
            <Route path="/:categorySlug/:productSlug" element={<LegacyProductRedirect />} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });
  });

  describe('BlogLegacyWrapper', () => {
    const BlogDetailMock = () => <div>Blog Detail</div>;

    it('redirects /blog/post-b123.html to /blog/post', () => {
      render(
        <MemoryRouter initialEntries={['/blog/my-post-b123.html']}>
          <Routes>
            <Route path="/blog/:slug" element={
              <BlogLegacyWrapper>
                <BlogDetailMock />
              </BlogLegacyWrapper>
            } />
            <Route path="/blog/my-post" element={<LocationDisplay />} />
          </Routes>
        </MemoryRouter>
      );
      // Note: The redirection target /blog/my-post matches the route /blog/:slug again?
      // Wait, if it redirects to /blog/my-post, the route /blog/:slug matches again.
      // Inside BlogLegacyWrapper, slug="my-post". Matches regex? No.
      // So it renders children (BlogDetailMock).
      // But we want to assert the location changed.
      // Since BlogDetailMock is rendered, we can check that, BUT we also want to know the URL is correct.
      // LocationDisplay won't be rendered if the wrapper renders children at the same route path.
      // So we check if BlogDetailMock is rendered AND if the router state is updated?
      // Or we define a separate route for the target to verifying redirection strictly.
      // But in the app, the target route IS the same route definition.
      // Let's rely on LocationDisplay if we can force it to match?
      // Actually, if it redirects, it renders the same Route.
      // So `BlogLegacyWrapper` re-runs with new slug.
      // New slug "my-post" doesn't match regex.
      // So it renders `children`.
      // But in this test setup, we have a specific route for /blog/my-post that renders LocationDisplay.
      // So we expect LocationDisplay to show the new URL.
      expect(screen.getByTestId('location')).toHaveTextContent('/blog/my-post');
    });

    it('verifies redirection target url', () => {
        // We can use a trick: define a different route for the target to prove redirection happened?
        // But the redirect is to `/blog/...`.
        // We can mock Navigate? No, we want integration test.
        // We can put a component inside the wrapper that logs location?
        const TestChild = () => {
            const location = useLocation();
            return <div data-testid="child-location">{location.pathname}</div>;
        };
        render(
            <MemoryRouter initialEntries={['/blog/my-post-b123.html']}>
              <Routes>
                <Route path="/blog/:slug" element={
                  <BlogLegacyWrapper>
                    <TestChild />
                  </BlogLegacyWrapper>
                } />
              </Routes>
            </MemoryRouter>
          );
          expect(screen.getByTestId('child-location')).toHaveTextContent('/blog/my-post');
    });

    it('renders children for normal blog url', () => {
      render(
        <MemoryRouter initialEntries={['/blog/normal-post']}>
          <Routes>
            <Route path="/blog/:slug" element={
              <BlogLegacyWrapper>
                <div data-testid="blog-content">Content</div>
              </BlogLegacyWrapper>
            } />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByTestId('blog-content')).toBeInTheDocument();
    });
  });
});
