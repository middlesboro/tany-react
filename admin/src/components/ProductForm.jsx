import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import SearchSelect from './SearchSelect';
import MultiSearchSelect from './MultiSearchSelect';
import { quillModules } from '../utils/quillConfig';
import 'react-quill-new/dist/quill.snow.css';

const ProductForm = ({
  activeTab,
  setActiveTab,
  product,
  brands,
  suppliers,
  categories,
  filterParameters,
  filterParameterValues,
  productLabels,
  handleChange,
  handleSubmit,
  handleSaveAndStay
}) => {
  const [selectedParamId, setSelectedParamId] = useState('');
  const [selectedValueId, setSelectedValueId] = useState('');

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

  const handleAddParam = () => {
    if (!selectedParamId || !selectedValueId) return;

    // Check for duplicates
    const isDuplicate = (product.productFilterParameters || []).some(
      p => p.filterParameterId === selectedParamId && p.filterParameterValueId === selectedValueId
    );

    if (isDuplicate) {
      alert("This attribute is already added.");
      return;
    }

    const newParams = [
      ...(product.productFilterParameters || []),
      { filterParameterId: selectedParamId, filterParameterValueId: selectedValueId }
    ];
    handleChange({ target: { name: 'productFilterParameters', value: newParams } });
    setSelectedParamId('');
    setSelectedValueId('');
  };

  const handleRemoveParam = (index) => {
    const newParams = [...(product.productFilterParameters || [])];
    newParams.splice(index, 1);
    handleChange({ target: { name: 'productFilterParameters', value: newParams } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 border-b">
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === 'main' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('main')}
        >
          Main
        </button>
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === 'attributes' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('attributes')}
        >
          Attributes
        </button>
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === 'prices' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('prices')}
        >
          Prices
        </button>
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === 'seo' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('seo')}
        >
          SEO
        </button>
      </div>

      {activeTab === 'main' && (
        <>
          <div className="mb-4 flex items-center">
            <input
              id="active"
              type="checkbox"
              name="active"
              checked={product.active}
              onChange={(e) => handleChange({ target: { name: 'active', value: e.target.checked } })}
              className="mr-2"
            />
            <label htmlFor="active" className="text-gray-700">Active</label>
          </div>
          <div className="mb-4 flex items-center">
            <input
                id="externalStock"
                type="checkbox"
                name="externalStock"
                checked={product.externalStock}
                onChange={(e) => handleChange({ target: { name: 'externalStock', value: e.target.checked } })}
                className="mr-2"
            />
            <label htmlFor="externalStock" className="text-gray-700">External stock</label>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">EAN</label>
              <input
                type="text"
                name="ean"
                value={product.ean || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Product Code</label>
              <input
                type="text"
                name="productCode"
                value={product.productCode || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Weight</label>
              <input
                type="number"
                name="weight"
                value={product.weight || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
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
        <SearchSelect
            label="Default Category"
            options={categories}
            value={product.defaultCategoryId}
            onChange={handleSelectChange('defaultCategoryId')}
            placeholder="Search for a default category..."
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
        </>
      )}

      {activeTab === 'attributes' && (
        <>
          <div className="mb-4">
            <MultiSearchSelect
              label="Product Labels"
              options={productLabels}
              value={product.productLabelIds}
              onChange={handleMultiSelectChange('productLabelIds')}
              placeholder="Search for labels..."
            />
          </div>

          {filterParameters && filterParameterValues && (
            <div className="mb-6 border p-4 rounded bg-gray-50">
              <h3 className="text-lg font-medium mb-3">Attributes (Filter Parameters)</h3>

              <div className="mb-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b py-2 px-3">Parameter</th>
                      <th className="border-b py-2 px-3">Value</th>
                      <th className="border-b py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(product.productFilterParameters || []).map((p, index) => {
                      const paramName = filterParameters.find(fp => fp.id === p.filterParameterId)?.name || 'Unknown';
                      const valueName = filterParameterValues.find(fv => fv.id === p.filterParameterValueId)?.name || 'Unknown';
                      return (
                        <tr key={index} className="border-b hover:bg-white">
                          <td className="py-2 px-3">{paramName}</td>
                          <td className="py-2 px-3">{valueName}</td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveParam(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {(product.productFilterParameters || []).length === 0 && (
                      <tr>
                        <td colSpan="3" className="py-2 px-3 text-gray-500 text-center">No attributes added.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <SearchSelect
                  label="Parameter"
                  options={filterParameters.map(p => ({ id: p.id, name: p.name }))}
                  value={selectedParamId}
                  onChange={setSelectedParamId}
                  placeholder="Select Parameter"
                />
                <SearchSelect
                  label="Value"
                  options={filterParameterValues
                    .filter(v => v.filterParameterId === selectedParamId)
                    .map(v => ({ id: v.id, name: v.name }))}
                  value={selectedValueId}
                  onChange={setSelectedValueId}
                  placeholder="Select Value"
                  disabled={!selectedParamId}
                />
                <button
                  type="button"
                  onClick={handleAddParam}
                  disabled={!selectedParamId || !selectedValueId}
                  className="bg-blue-500 text-white px-4 py-2 rounded h-10 disabled:bg-blue-300"
                >
                  Add Attribute
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'prices' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={product.price || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Price Without VAT</label>
              <input
                type="number"
                name="priceWithoutVat"
                value={product.priceWithoutVat || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Wholesale Price</label>
              <input
                type="number"
                name="wholesalePrice"
                value={product.wholesalePrice || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <h3 className="text-lg font-bold mb-2">Discount</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">Discount Price</label>
              <input
                type="number"
                name="discountPrice"
                value={product.discountPrice || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Discount Price Without VAT</label>
              <input
                type="number"
                name="discountPriceWithoutVat"
                value={product.discountPriceWithoutVat || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Discount Value</label>
              <input
                type="number"
                name="discountValue"
                value={product.discountValue || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Discount Percentual Value</label>
              <input
                type="number"
                name="discountPercentualValue"
                value={product.discountPercentualValue || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
        </>
      )}

      {activeTab === 'seo' && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={product.metaTitle || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Meta Description</label>
            <textarea
              name="metaDescription"
              value={product.metaDescription || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded h-32"
            />
          </div>
        </>
      )}

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
