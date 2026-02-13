import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import SeoHead from './SeoHead';

describe('SeoHead', () => {
  test('renders title and meta tags', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <SeoHead title="Test Title" description="Test Description" />
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
        expect(document.title).toBe('Test Title - Tany.sk');

        const descriptionMeta = document.querySelector('meta[name="description"]');
        expect(descriptionMeta).toBeInTheDocument();
        expect(descriptionMeta).toHaveAttribute('content', 'Test Description');

        const ogTitleMeta = document.querySelector('meta[property="og:title"]');
        expect(ogTitleMeta).toBeInTheDocument();
        expect(ogTitleMeta).toHaveAttribute('content', 'Test Title');
    });
  });

  test('renders product tags', async () => {
    const product = {
        price: 12,
        discountPrice: 12,
        weight: 0.5
    };

    render(
      <HelmetProvider>
        <MemoryRouter>
            <SeoHead title="Product" description="Desc" type="product" product={product} />
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
        const priceMeta = document.querySelector('meta[property="product:price:amount"]');
        expect(priceMeta).toBeInTheDocument();
        expect(priceMeta).toHaveAttribute('content', '12.00');

        const weightMeta = document.querySelector('meta[property="product:weight:value"]');
        expect(weightMeta).toBeInTheDocument();
        expect(weightMeta).toHaveAttribute('content', '0.500000');
    });
  });
});
