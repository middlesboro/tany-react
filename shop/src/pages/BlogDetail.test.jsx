import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import BlogDetail from './BlogDetail';
import { getBlog } from '../services/blogService';
import { BreadcrumbProvider } from '../context/BreadcrumbContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock the blog service
vi.mock('../services/blogService');

// Mock useParams by wrapping in MemoryRouter
const renderWithRouter = (ui, { route = '/blog/1' } = {}) => {
  return render(
    <HelmetProvider>
      <BreadcrumbProvider>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/blog/:id" element={ui} />
          </Routes>
        </MemoryRouter>
      </BreadcrumbProvider>
    </HelmetProvider>
  );
};

describe('BlogDetail', () => {
  const mockBlog = {
    id: 1,
    title: 'Test Blog',
    author: 'Test Author',
    createdDate: '2023-01-01',
    shortDescription: 'Short description',
    // The problematic description with non-breaking spaces
    description: '<p>This&nbsp;is&nbsp;a&nbsp;test&nbsp;content&nbsp;with&nbsp;non-breaking&nbsp;spaces.</p>',
    image: 'test.jpg'
  };

  beforeEach(() => {
    getBlog.mockResolvedValue(mockBlog);
  });

  test('sanitizes blog description by replacing non-breaking spaces', async () => {
    renderWithRouter(<BlogDetail />, { route: '/blog/1' });

    // Wait for the blog to load
    await waitFor(() => screen.getByText('Test Blog'));

    // Find the description content
    // We look for the text content.
    // "This is a test content with non-breaking spaces."
    // But we want to verify the spaces are non-breaking (char code 160)

    // Using a regex to find the text node might be tricky if testing library normalizes spaces.
    // However, innerHTML should preserve it if it was injected via dangerouslySetInnerHTML

    // We can access the container text content and check character codes.
    const descriptionElement = screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && content.includes('This');
    });

    const textContent = descriptionElement.textContent;

    // Check if there are non-breaking spaces (code 160)
    // Note: If the fix is NOT applied, we expect non-breaking spaces.
    // But wait, if the source is `&nbsp;`, React `dangerouslySetInnerHTML` renders it as `\u00A0`.
    // So we check for `\u00A0`.

    const hasNbsp = textContent.includes('\u00A0');

    // For this step (verification), we assert that it does NOT contain nbsp.
    expect(hasNbsp).toBe(false);
  });
});
