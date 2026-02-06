import React, { useEffect, useState } from 'react';
import { getProductBySlug } from '../services/productService';
import ProductCard from './ProductCard';

const ProductEmbed = ({ slug }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product for embed", slug, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
        <div className="h-full min-h-[400px] flex items-center justify-center bg-gray-50 border border-gray-100 rounded">
            <span className="text-gray-400">Načítavam produkt...</span>
        </div>
    );
  }

  if (error || !product) {
      return null;
  }

  return <ProductCard product={product} />;
};

export default ProductEmbed;
