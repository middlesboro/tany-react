import React from 'react';
import ReactQuill from 'react-quill-new';
import SearchSelect from './SearchSelect';
import { quillModules } from '../utils/quillConfig';
import 'react-quill-new/dist/quill.snow.css';

const CategoryForm = ({ category, handleChange, handleSubmit, categories = [], handleParentChange }) => {
  const parentOptions = categories.map((c) => ({ id: c.id, name: c.title }));

  const handleQuillChange = (name) => (value) => {
    // ReactQuill returns the HTML value directly
    handleChange({
      target: {
        name,
        value
      }
    });
  };

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
        <ReactQuill
          theme="snow"
          value={category.description || ''}
          onChange={handleQuillChange('description')}
          modules={quillModules}
          className="bg-white"
        />
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
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="defaultCategory"
          name="defaultCategory"
          checked={category.defaultCategory || false}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="defaultCategory" className="text-gray-700 cursor-pointer">
          Default Category
        </label>
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
};

export default CategoryForm;
