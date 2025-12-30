import React from 'react';
import { Link } from 'react-router-dom';
import CategoryList from '../components/CategoryList';

const Categories = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <Link to="/categories/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Category
        </Link>
      </div>
      <CategoryList />
    </div>
  );
};

export default Categories;
