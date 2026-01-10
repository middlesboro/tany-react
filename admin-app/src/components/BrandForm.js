import React from 'react';

const BrandForm = ({ brand, handleChange, handleSubmit, handleSaveAndStay }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={brand.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Meta Title</label>
        <input
          type="text"
          name="metaTitle"
          value={brand.metaTitle || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Meta Description</label>
        <textarea
          name="metaDescription"
          value={brand.metaDescription || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          rows="3"
        />
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="active"
            checked={brand.active}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-gray-700">Active</span>
        </label>
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

export default BrandForm;
