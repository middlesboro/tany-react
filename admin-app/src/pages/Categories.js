import React, { useState } from 'react';
import CategoryList from '../components/CategoryList';
import CategoryForm from '../components/CategoryForm';

const Categories = () => {
  const [currentCategory, setCurrentCategory] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (category) => {
    setCurrentCategory(category);
  };

  const handleSave = () => {
    setCurrentCategory(null);
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <CategoryForm currentCategory={currentCategory} onSave={handleSave} />
        </div>
        <div>
          <CategoryList onEdit={handleEdit} key={refresh} />
        </div>
      </div>
    </div>
  );
};

export default Categories;
