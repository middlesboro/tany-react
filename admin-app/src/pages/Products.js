import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

const Products = () => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (product) => {
    setCurrentProduct(product);
  };

  const handleSave = () => {
    setCurrentProduct(null);
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ProductForm currentProduct={currentProduct} onSave={handleSave} />
        </div>
        <div>
          <ProductList onEdit={handleEdit} key={refresh} />
        </div>
      </div>
    </div>
  );
};

export default Products;
