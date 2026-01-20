import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminProducts, deleteProduct, patchProduct } from '../services/productAdminService';
import { getBrands } from '../services/brandAdminService';
import SearchSelect from './SearchSelect';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('title,asc');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Filter states
  const [filter, setFilter] = useState({
    query: '',
    priceFrom: '',
    priceTo: '',
    brandId: '',
    id: '',
    externalStock: '',
    quantity: '',
    active: '',
  });
  const [appliedFilter, setAppliedFilter] = useState({});
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const data = await getBrands(0, 'name,asc', 100);
      setBrands(data.content);
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAdminProducts(page, sort, size, appliedFilter);
      setProducts(data.content);
      setTotalPages(data.totalPages);
    };
    fetchProducts();
  }, [page, sort, size, appliedFilter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const handleBrandChange = (value) => {
    setFilter({
      ...filter,
      brandId: value,
    });
  };

  const handleFilterSubmit = () => {
    setAppliedFilter(filter);
    setPage(0);
  };

  const handleClearFilter = () => {
    const emptyFilter = {
      query: '',
      priceFrom: '',
      priceTo: '',
      brandId: '',
      id: '',
      externalStock: '',
      quantity: '',
      active: '',
    };
    setFilter(emptyFilter);
    setAppliedFilter({});
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleSort = (field) => {
    const [currentField, currentDirection] = sort.split(',');
    if (currentField === field) {
      setSort(`${field},${currentDirection === 'asc' ? 'desc' : 'asc'}`);
    } else {
      setSort(`${field},asc`);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditFormData({
      title: product.title,
      price: product.price,
      quantity: product.quantity,
      externalStock: product.externalStock,
      active: product.active,
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveClick = async (id) => {
    const updatedProduct = await patchProduct(id, editFormData);
    setProducts(products.map((p) => (p.id === id ? updatedProduct : p)));
    setEditingId(null);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-gray-100 p-4 mb-4 rounded shadow">
        <h2 className="text-lg font-bold mb-2">Filter Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700">Query</label>
            <input
              type="text"
              name="query"
              value={filter.query}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">ID</label>
            <input
              type="text"
              name="id"
              value={filter.id}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Product ID"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Price From</label>
            <input
              type="number"
              name="priceFrom"
              value={filter.priceFrom}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Min Price"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Price To</label>
            <input
              type="number"
              name="priceTo"
              value={filter.priceTo}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Max Price"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={filter.quantity}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Quantity"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <SearchSelect
              label="Brand"
              options={brands}
              value={filter.brandId}
              onChange={handleBrandChange}
              placeholder="Select Brand"
            />
          </div>
          <div>
            <label className="block text-gray-700">External Stock</label>
            <select
              name="externalStock"
              value={filter.externalStock}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Active</label>
            <select
              name="active"
              value={filter.active}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleFilterSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Filter
          </button>
          <button
            onClick={handleClearFilter}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('title')}>
              Title
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('price')}>
              Price
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('quantity')}>
              Quantity
            </th>
            <th className="py-2 px-4 border-b">Brand</th>
            <th className="py-2 px-4 border-b">Ext. Stock</th>
            <th className="py-2 px-4 border-b">Active</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              {editingId === product.id ? (
                <>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleInputChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleInputChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="number"
                      name="quantity"
                      value={editFormData.quantity}
                      onChange={handleInputChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    {brands.find(b => b.id === product.brandId)?.name || ''}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="checkbox"
                      name="externalStock"
                      checked={editFormData.externalStock || false}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="checkbox"
                      name="active"
                      checked={editFormData.active || false}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleSaveClick(product.id)}
                      className="text-green-500 hover:text-green-700 mr-2"
                      title="Save"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="text-gray-500 hover:text-gray-700"
                      title="Cancel"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-4 border-b">{product.title}</td>
                  <td className="py-2 px-4 border-b">{product.price}</td>
                  <td className="py-2 px-4 border-b">{product.quantity}</td>
                  <td className="py-2 px-4 border-b">
                    {brands.find(b => b.id === product.brandId)?.name || ''}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {product.externalStock ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                       <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {product.active ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                       <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="text-blue-500 hover:text-blue-700 mr-2 inline-block"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-yellow-500 hover:text-yellow-700 mr-2"
                      title="Quick Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <span className="mr-2">Items per page:</span>
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="border rounded p-1"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          >
            Previous
          </button>
          <span className="mr-2">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page + 1 >= totalPages}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
