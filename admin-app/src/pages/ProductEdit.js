import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '../services/productService';
import ProductForm from '../components/ProductForm';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: '',
    shortDescription: '',
    description: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const data = await getProduct(id);
        setProduct(data);
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
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
    </div>
  );
};

export default ProductEdit;
