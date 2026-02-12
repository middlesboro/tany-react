import React from 'react';
import { render } from '@testing-library/react';
import ProductJsonLd from './ProductJsonLd';

describe('ProductJsonLd', () => {
  const mockProduct = {
    id: 123,
    title: 'Test Product',
    slug: 'test-product',
    images: ['image1.jpg'],
    description: '<p>Test description</p>',
    price: 20.0,
    discountPrice: null,
    quantity: 10,
    averageRating: 4.5,
    reviewsCount: 5,
  };

  it('renders correct JSON-LD structure', () => {
    const { container } = render(<ProductJsonLd product={mockProduct} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const json = JSON.parse(script.innerHTML);
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('Product');
    expect(json.name).toBe('Test Product');
    expect(json.sku).toBe(123);
    expect(json.description).toBe('Test description');
    expect(json.image).toEqual(['image1.jpg']);
    expect(json.offers.price).toBe(20.0);
    expect(json.offers.availability).toBe('https://schema.org/InStock');
    expect(json.aggregateRating.ratingValue).toBe(4.5);
    expect(json.aggregateRating.reviewCount).toBe(5);
  });

  it('handles discount price', () => {
    const productWithDiscount = { ...mockProduct, discountPrice: 15.0 };
    const { container } = render(<ProductJsonLd product={productWithDiscount} />);
    const script = container.querySelector('script');
    const json = JSON.parse(script.innerHTML);
    expect(json.offers.price).toBe(15.0);
  });

  it('handles out of stock', () => {
    const outOfStockProduct = { ...mockProduct, quantity: 0 };
    const { container } = render(<ProductJsonLd product={outOfStockProduct} />);
    const script = container.querySelector('script');
    const json = JSON.parse(script.innerHTML);
    expect(json.offers.availability).toBe('https://schema.org/OutOfStock');
  });

  it('omits aggregateRating if no reviews', () => {
    const noReviewsProduct = { ...mockProduct, reviewsCount: 0 };
    const { container } = render(<ProductJsonLd product={noReviewsProduct} />);
    const script = container.querySelector('script');
    const json = JSON.parse(script.innerHTML);
    expect(json.aggregateRating).toBeUndefined();
  });

  it('strips HTML from description', () => {
    const htmlProduct = { ...mockProduct, description: '<div><p>Hello</p><br/>World</div>' };
    const { container } = render(<ProductJsonLd product={htmlProduct} />);
    const script = container.querySelector('script');
    const json = JSON.parse(script.innerHTML);
    expect(json.description).toBe('HelloWorld');
  });
});
