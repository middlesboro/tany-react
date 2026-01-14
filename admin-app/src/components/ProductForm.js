import React from 'react';
import ReactQuill from 'react-quill-new';
import SearchSelect from './SearchSelect';
import MultiSearchSelect from './MultiSearchSelect';
import { quillModules } from '../utils/quillConfig';
import 'react-quill-new/dist/quill.snow.css';

const ProductForm = ({ product, brands, suppliers, categories, handleChange, handleSubmit, handleSaveAndStay }) => {
  const handleQuillChange = (name) => (value) => {
    // ReactQuill returns the HTML value directly
    handleChange({
      target: {
        name,
        value
      }
    });
  };

  const handleSelectChange = (name) => (value) => {
    handleChange({
      target: {
        name,
        value
      }
    });
  };

  const handleMultiSelectChange = (name) => (value) => {
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
          value={product.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchSelect
          label="Brand"
          options={brands}
          value={product.brandId}
          onChange={handleSelectChange('brandId')}
          placeholder="Search for a brand..."
        />
        <SearchSelect
          label="Supplier"
          options={suppliers}
          value={product.supplierId}
          onChange={handleSelectChange('supplierId')}
          placeholder="Search for a supplier..."
        />
      </div>

      <div className="mb-4">
        <MultiSearchSelect
          label="Categories"
          options={categories}
          value={product.categoryIds}
          onChange={handleMultiSelectChange('categoryIds')}
          placeholder="Search for categories..."
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Short Description</label>
        <ReactQuill
          theme="snow"
          value={product.shortDescription}
          onChange={handleQuillChange('shortDescription')}
          modules={quillModules}
          className="bg-white"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <ReactQuill
          theme="snow"
          value={product.description}
          onChange={handleQuillChange('description')}
          modules={quillModules}
          className="bg-white"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save
      </button>
      <button
        type="button"
        onClick={handleSaveAndStay}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
      >
        Save and stay
      </button>
    </form>
  );
};

export default ProductForm;
