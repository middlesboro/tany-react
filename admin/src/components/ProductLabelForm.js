import React from 'react';

const ProductLabelForm = ({ productLabel, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={productLabel.title || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Color</label>
        <div className="flex items-center">
            <input
            type="color"
            name="color"
            value={productLabel.color || '#000000'}
            onChange={handleChange}
            className="w-10 h-10 border rounded mr-2"
            />
             <input
            type="text"
            name="color"
            value={productLabel.color || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Background Color</label>
         <div className="flex items-center">
            <input
            type="color"
            name="backgroundColor"
            value={productLabel.backgroundColor || '#ffffff'}
            onChange={handleChange}
            className="w-10 h-10 border rounded mr-2"
            />
            <input
            type="text"
            name="backgroundColor"
            value={productLabel.backgroundColor || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Position</label>
        <select
          name="position"
          value={productLabel.position || 'TOP_RIGHT'}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="TOP_RIGHT">Top Right</option>
          <option value="TOP_LEFT">Top Left</option>
          <option value="BOTTOM_RIGHT">Bottom Right</option>
          <option value="BOTTOM_LEFT">Bottom Left</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="flex items-center text-gray-700">
          <input
            type="checkbox"
            name="active"
            checked={productLabel.active || false}
            onChange={(e) => handleChange({ target: { name: 'active', value: e.target.checked } })}
            className="mr-2"
          />
          Active
        </label>
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
};

export default ProductLabelForm;
