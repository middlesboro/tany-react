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
        <Link to="/admin/product-labels/new" className="bg-green-500 text-white px-4 py-2 rounded">
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
                <Link to={`/admin/product-labels/${label.id}`} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(label.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
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
