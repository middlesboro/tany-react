import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import NotFound from '../pages/NotFound';

// Handles /content/{id}-{slug} -> /{slug}
export const LegacyContentRedirect = () => {
  const { idSlug } = useParams();
  const match = idSlug?.match(/^(\d+)-(.*)$/);

  if (match) {
    // Redirect to /{slug}
    return <Navigate to={`/${match[2]}`} replace />;
  }

  return <NotFound />;
};

// Handles /{categorySlug}/{productId}-{slug}.html -> /produkt/{slug}
// Also handles /{categorySlug}/{productId}-{slug}-{ean}.html -> /produkt/{slug}
export const LegacyProductRedirect = () => {
  const { productSlug } = useParams();
  // Check if productSlug matches {id}-{slug}.html or {id}-{slug}-{ean}.html
  // Regex:
  // ^(\d+)-    Starts with digits (ID) and hyphen
  // (.*)       Captures the slug (greedy, potentially including EAN part initially)
  // \.html$    Ends with .html
  const match = productSlug?.match(/^(\d+)-(.*)\.html$/);

  if (match) {
    let slug = match[2];

    // Check if the slug part ends with an EAN (hyphen followed by 8+ digits)
    // EAN-8, EAN-13, UPC-A (12), GTIN-14 are common.
    // We'll use 8 digits as a safe minimum to distinguish from version numbers like "iphone-15".
    const eanMatch = slug.match(/^(.*)-(\d{8,})$/);
    if (eanMatch) {
      slug = eanMatch[1];
    }

    // Redirect to /produkt/{slug}
    return <Navigate to={`/produkt/${slug}`} replace />;
  }

  return <NotFound />;
};

// Wrapper for /blog/{slug}-b{id}.html -> /blog/{slug}
export const BlogLegacyWrapper = ({ children }) => {
  const { slug } = useParams();
  // Check if slug matches {slug}-b{id}.html
  const match = slug?.match(/^(.*)-b\d+\.html$/);

  if (match) {
    // Redirect to /blog/{slug} (stripped)
    return <Navigate to={`/blog/${match[1]}`} replace />;
  }

  return children;
};
