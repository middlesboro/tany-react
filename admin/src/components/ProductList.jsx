import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminProducts, deleteProduct, patchProduct, getProduct } from '../services/productAdminService';
import { getBrands } from '../services/brandAdminService';
import SearchSelect from './SearchSelect';
import usePersistentTableState from '../hooks/usePersistentTableState';

const ProductList = () => {
  const {
    page, setPage,
    size, setSize,
    sort, handleSort,
    filter, setFilter, handleFilterChange,
    appliedFilter,
    handleFilterSubmit, handleClearFilter
  } = usePersistentTableState('admin_products_list_state', {
    query: '',
    priceFrom: '',
    priceTo: '',
    brandId: '',
    productIdentifier: '',
    id: '',
    externalStock: '',
    quantity: '',
    active: '',
  }, 'title,asc');

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const data = await getBrands(0, 'name,asc', 300);
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

  const handleBrandChange = (value) => {
    setFilter({
      ...filter,
      brandId: value,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleDuplicate = async (productId) => {
    try {
      const fullProduct = await getProduct(productId);
      const duplicateData = {
        ...fullProduct,
        id: undefined,
        productIdentifier: undefined,
        title: `${fullProduct.title} - copy`,
        images: [],
      };
      navigate('/products/new', { state: { duplicateProduct: duplicateData } });
    } catch (error) {
      console.error("Failed to duplicate product", error);
      alert("Failed to duplicate product.");
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
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
           </svg>
           <h2 className="text-lg font-semibold text-gray-700">Filter</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
            <input
              type="text"
              name="query"
              value={filter.query}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Search by name..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-ps-primary focus:border-ps-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">ID</label>
            <input
              type="number"
              name="productIdentifier"
              value={filter.productIdentifier}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Product ID"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-ps-primary focus:border-ps-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">UUID</label>
            <input
              type="text"
              name="id"
              value={filter.id}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="UUID"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-ps-primary focus:border-ps-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Price From</label>
            <input
              type="number"
              name="priceFrom"
              value={filter.priceFrom}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Min Price"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-ps-primary focus:border-ps-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Price To</label>
            <input
              type="number"
              name="priceTo"
              value={filter.priceTo}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Max Price"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-ps-primary focus:border-ps-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={filter.quantity}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Quantity"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-ps-primary focus:border-ps-primary"
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
            <label className="block text-xs font-medium text-gray-500 mb-1">External Stock</label>
            <select
              name="externalStock"
              value={filter.externalStock}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-ps-primary focus:border-ps-primary"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Active</label>
            <select
              name="active"
              value={filter.active}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-ps-primary focus:border-ps-primary"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleFilterSubmit}
            className="bg-ps-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-ps-primary-hover transition-colors shadow-sm flex items-center gap-2"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
             </svg>
            Filter
          </button>
          <button
            onClick={handleClearFilter}
            className="bg-white text-gray-600 px-4 py-2 rounded text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
         <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-700">
               Product List
               <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{products.length} / {size * totalPages}</span>
            </h3>
         </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('productIdentifier')}>
                  <div className="flex items-center gap-1">Id {sort.startsWith('productIdentifier') && (sort.endsWith('desc') ? '▼' : '▲')}</div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('title')}>
                   <div className="flex items-center gap-1">Title {sort.startsWith('title') && (sort.endsWith('desc') ? '▼' : '▲')}</div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('price')}>
                   <div className="flex items-center gap-1">Price {sort.startsWith('price') && (sort.endsWith('desc') ? '▼' : '▲')}</div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('quantity')}>
                   <div className="flex items-center gap-1">Qty {sort.startsWith('quantity') && (sort.endsWith('desc') ? '▼' : '▲')}</div>
                </th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4 text-center">Ext. Stock</th>
                <th className="py-3 px-4 text-center">Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  {editingId === product.id ? (
                    <>
                      <td className="py-3 px-4 text-gray-500">
                        {product.productIdentifier}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          name="title"
                          value={editFormData.title}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          name="price"
                          value={editFormData.price}
                          onChange={handleInputChange}
                          className="w-24 px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          name="quantity"
                          value={editFormData.quantity}
                          onChange={handleInputChange}
                          className="w-20 px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {brands.find(b => b.id === product.brandId)?.name || ''}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          name="externalStock"
                          checked={editFormData.externalStock || false}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-ps-primary rounded focus:ring-ps-primary"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          name="active"
                          checked={editFormData.active || false}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-ps-primary rounded focus:ring-ps-primary"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleSaveClick(product.id)}
                              className="text-green-600 hover:bg-green-50 p-1 rounded"
                              title="Save"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={handleCancelClick}
                              className="text-gray-500 hover:bg-gray-100 p-1 rounded"
                              title="Cancel"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                         </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 text-gray-500 font-mono text-xs">{product.productIdentifier}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{product.title}</td>
                      <td className="py-3 px-4">
                        {product.discountPrice ? (
                          <div className="flex flex-col">
                            <span className="line-through text-gray-400 text-xs">{product.price} €</span>
                            <span className="text-red-600 font-bold">{product.discountPrice} €</span>
                          </div>
                        ) : (
                           <span>{product.price} €</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${product.quantity <= 0 ? 'bg-red-100 text-red-800' :
                              product.quantity < 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {product.quantity}
                         </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {brands.find(b => b.id === product.brandId)?.name || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {product.externalStock ? (
                          <div className="flex justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                             </svg>
                          </div>
                        ) : (
                           <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {product.active ? (
                          <div className="flex justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                             </svg>
                          </div>
                        ) : (
                           <div className="flex justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                           </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                         <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/products/${product.id}`}
                              className="text-gray-500 hover:text-ps-primary hover:bg-gray-100 p-1.5 rounded transition-colors"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleEditClick(product)}
                              className="text-gray-500 hover:text-tany-yellow hover:bg-gray-100 p-1.5 rounded transition-colors"
                              title="Quick Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDuplicate(product.id)}
                              className="text-gray-500 hover:text-indigo-600 hover:bg-gray-100 p-1.5 rounded transition-colors"
                              title="Duplicate"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-gray-500 hover:text-red-600 hover:bg-gray-100 p-1.5 rounded transition-colors"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                         </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 md:mb-0">
             <span>Show</span>
             <select
               value={size}
               onChange={(e) => {
                 setSize(Number(e.target.value));
                 setPage(0);
               }}
               className="border border-gray-300 rounded px-2 py-1 focus:ring-ps-primary focus:border-ps-primary"
             >
               <option value={10}>10</option>
               <option value={25}>25</option>
               <option value={50}>50</option>
             </select>
             <span>entries</span>
          </div>

          <div className="flex items-center gap-1">
             <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className={`px-3 py-1 rounded border ${page === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
             >
                Previous
             </button>
             <div className="text-sm text-gray-600 px-2">
                Page {page + 1} of {totalPages}
             </div>
             <button
                onClick={() => setPage(page + 1)}
                disabled={page + 1 >= totalPages}
                className={`px-3 py-1 rounded border ${page + 1 >= totalPages ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
             >
                Next
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
