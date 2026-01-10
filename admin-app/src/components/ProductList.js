import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminProducts, deleteProduct, patchProduct } from '../services/productAdminService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('title,asc');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAdminProducts(page, sort, size);
      setProducts(data.content);
      setTotalPages(data.totalPages);
    };
    fetchProducts();
  }, [page, sort, size]);

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
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  return (
    <div>
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
                    <button
                      onClick={() => handleSaveClick(product.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-4 border-b">{product.title}</td>
                  <td className="py-2 px-4 border-b">{product.price}</td>
                  <td className="py-2 px-4 border-b">{product.quantity}</td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleEditClick(product)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Quick Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
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
