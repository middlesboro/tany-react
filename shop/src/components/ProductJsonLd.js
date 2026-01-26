import React from 'react';

const stripHtml = (html) => {
   if (!html) return '';
   return html.replace(/<[^>]*>?/gm, '');
};

const ProductJsonLd = ({ product }) => {
  if (!product) return null;

  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
  const productUrl = `${origin}/product/${product.slug}`;

  // Price logic
  const price = product.discountPrice || product.price || 0;

  // Availability
  const availability = product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images && product.images.length > 0 ? product.images : [],
    description: stripHtml(product.description),
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'EUR',
      price: price,
      availability: availability,
    },
  };

  if (product.reviewsCount > 0 && product.averageRating) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating,
      reviewCount: product.reviewsCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default ProductJsonLd;
