import React from 'react';
import { Link } from 'react-router-dom';
import BrandList from '../components/BrandList';

const Brands = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Brand Management</h1>
        <Link to="/admin/brands/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Brand
        </Link>
      </div>
      <BrandList />
    </div>
  );
};

export default Brands;
