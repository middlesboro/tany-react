import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { VAT_RATE } from '../utils/constants';

const stripHtml = (html) => {
   if (!html) return '';
   return html.replace(/<[^>]*>?/gm, '');
};

const SeoHead = ({ title, description, type = 'website', image, url, product }) => {
  const location = useLocation();
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
  const currentUrl = url || `${origin}${location.pathname}`;
  const siteName = 'Tany.sk';

  const browserTitle = title ? `${title} - ${siteName}` : siteName;
  const metaDescription = description ? stripHtml(description) : "Prírodná kozmetika a henna na vlasy - Tany.sk";
  const metaImage = image;

  // Price logic for product
  let price = 0;
  let pretaxPrice = 0;

  if (product) {
      const activePrice = product.discountPrice || product.price || 0;
      price = activePrice;
      pretaxPrice = activePrice / VAT_RATE;
  }

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{browserTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title || siteName} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:description" content={metaDescription} />
      {metaImage && <meta property="og:image" content={metaImage} />}

      {/* Product Specific */}
      {type === 'product' && product && <meta property="product:pretax_price:amount" content={pretaxPrice.toFixed(6)} />}
      {type === 'product' && product && <meta property="product:pretax_price:currency" content="EUR" />}
      {type === 'product' && product && <meta property="product:price:amount" content={price.toFixed(2)} />}
      {type === 'product' && product && <meta property="product:price:currency" content="EUR" />}
      {type === 'product' && product && product.weight !== undefined && product.weight !== null && <meta property="product:weight:value" content={Number(product.weight).toFixed(6)} />}
      {type === 'product' && product && product.weight !== undefined && product.weight !== null && <meta property="product:weight:units" content="kg" />}
    </Helmet>
  );
};

export default SeoHead;
