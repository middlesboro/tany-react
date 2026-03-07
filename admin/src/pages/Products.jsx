import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';

const Products = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex gap-2">
          <Link to="/products/import" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Import Product
          </Link>
          <Link to="/products/new" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            Create Product
          </Link>
        </div>
      </div>
      <ProductList />
    </div>
  );
};

export default Products;
