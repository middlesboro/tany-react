import React from 'react';
import SearchSelect from './SearchSelect';

const CategoryForm = ({ category, handleChange, handleSubmit, categories = [], handleParentChange }) => {
  const parentOptions = categories.map((c) => ({ id: c.id, name: c.title }));

  return (
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
        <label className="block text-gray-700">Slug</label>
        <input
          type="text"
          name="slug"
          value={category.slug || ''}
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
      <div className="mb-4">
        <label className="block text-gray-700">Meta Title</label>
        <input
          type="text"
          name="metaTitle"
          value={category.metaTitle || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Meta Description</label>
        <textarea
          name="metaDescription"
          value={category.metaDescription || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        ></textarea>
      </div>
      <div className="mb-4">
        <SearchSelect
          label="Parent Category"
          options={parentOptions}
          value={category.parentId}
          onChange={handleParentChange}
          placeholder="Select parent category..."
        />
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
};

export default CategoryForm;
