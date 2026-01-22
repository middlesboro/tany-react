import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductLabels, deleteProductLabel } from '../services/productLabelAdminService';

const ProductLabelList = () => {
  const [productLabels, setProductLabels] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('title,asc');

  useEffect(() => {
    const fetchProductLabels = async () => {
      const data = await getProductLabels(page, sort, size);
      setProductLabels(data.content);
      setTotalPages(data.totalPages);
    };
    fetchProductLabels();
  }, [page, sort, size]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product label?')) {
      await deleteProductLabel(id);
      setProductLabels(productLabels.filter((label) => label.id !== id));
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

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link to="/product-labels/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Product Label
        </Link>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('title')}>
              Title
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('color')}>
              Color
            </th>
             <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('backgroundColor')}>
              Background Color
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('position')}>
              Position
            </th>
             <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('active')}>
              Active
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productLabels.map((label) => (
            <tr key={label.id}>
              <td className="py-2 px-4 border-b">{label.title}</td>
              <td className="py-2 px-4 border-b">
                 <div className="flex items-center">
                    <span className="inline-block w-4 h-4 mr-2 border" style={{ backgroundColor: label.color }}></span>
                    {label.color}
                 </div>
              </td>
              <td className="py-2 px-4 border-b">
                 <div className="flex items-center">
                    <span className="inline-block w-4 h-4 mr-2 border" style={{ backgroundColor: label.backgroundColor }}></span>
                    {label.backgroundColor}
                 </div>
              </td>
              <td className="py-2 px-4 border-b">{label.position}</td>
              <td className="py-2 px-4 border-b">{label.active ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border-b">
                <Link
                  to={`/product-labels/${label.id}`}
                  className="text-blue-500 hover:text-blue-700 mr-2 inline-block"
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDelete(label.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
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

export default ProductLabelList;
