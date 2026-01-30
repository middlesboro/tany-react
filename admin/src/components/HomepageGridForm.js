import React from 'react';
import SearchSelect from './SearchSelect';
import MultiSearchSelect from './MultiSearchSelect';

const HomepageGridForm = ({
  homepageGrid,
  brands,
  categories,
  products,
  handleChange,
  handleSubmit,
  handleSaveAndStay
}) => {
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
          value={homepageGrid.title || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Result Count</label>
        <input
          type="number"
          name="resultCount"
          value={homepageGrid.resultCount || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">Sort Field</label>
          <select
            name="sortField"
            value={homepageGrid.sortField || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Sort Field</option>
            <option value="PRICE">Price</option>
            <option value="TITLE">Title</option>
            <option value="CREATE_DATE">Create Date</option>
            <option value="PRIORITY">Priority</option>
            <option value="BEST_SELLING">Best Selling</option>
            <option value="RATING">Rating</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Sort Order</label>
          <select
            name="sortOrder"
            value={homepageGrid.sortOrder || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Sort Order</option>
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <SearchSelect
          label="Brand"
          options={brands}
          value={homepageGrid.brandId}
          onChange={handleSelectChange('brandId')}
          placeholder="Search for a brand..."
        />
      </div>

      <div className="mb-4">
        <SearchSelect
          label="Category"
          options={categories}
          value={homepageGrid.categoryId}
          onChange={handleSelectChange('categoryId')}
          placeholder="Search for a category..."
        />
      </div>

      <div className="mb-4">
        <MultiSearchSelect
          label="Products"
          options={products}
          value={homepageGrid.productIds || []}
          onChange={handleMultiSelectChange('productIds')}
          placeholder="Search for products..."
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

export default HomepageGridForm;
