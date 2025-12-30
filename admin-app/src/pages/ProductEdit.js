import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '../services/productService';
import ProductForm from '../components/ProductForm';
import ProductImageManager from '../components/ProductImageManager';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: '',
    shortDescription: '',
    description: '',
    price: '',
    quantity: '',
    images: [],
  });

  useEffect(() => {
    if (id) {
      const fetchProductData = async () => {
        const data = await getProduct(id);
        setProduct({ ...data, images: data.images || [] });
      };
      fetchProductData();
    }
  }, [id]);

  const refreshImages = async () => {
    if (id) {
      const data = await getProduct(id);
      setProduct(prevProduct => ({ ...prevProduct, images: data.images || [] }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImagesChange = (newImages) => {
    setProduct({ ...product, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateProduct(id, product);
    } else {
      await createProduct(product);
    }
    navigate('/admin/products');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Product' : 'Create Product'}</h1>
      <ProductForm product={product} handleChange={handleChange} handleSubmit={handleSubmit} />
      {id && (
        <ProductImageManager
          productId={id}
          images={product.images}
          onImagesChange={handleImagesChange}
          onUploadSuccess={refreshImages}
        />
      )}
    </div>
  );
};

export default ProductEdit;
