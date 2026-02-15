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
export const LegacyProductRedirect = () => {
  const { productSlug } = useParams();
  // Check if productSlug matches {id}-{slug}.html
  const match = productSlug?.match(/^(\d+)-(.*)\.html$/);

  if (match) {
    // Redirect to /produkt/{slug}
    return <Navigate to={`/produkt/${match[2]}`} replace />;
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
