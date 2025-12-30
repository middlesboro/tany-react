import React, { useState, useEffect } from 'react';
import { createCategory, updateCategory } from '../services/categoryService';

const CategoryForm = ({ currentCategory, onSave }) => {
  const [category, setCategory] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    if (currentCategory) {
      setCategory(currentCategory);
    }
  }, [currentCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category.id) {
      await updateCategory(category.id, category);
    } else {
      await createCategory(category);
    }
    onSave();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{category.id ? 'Edit Category' : 'Create Category'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={category.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={category.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
