import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFilterParameters, deleteFilterParameter } from '../services/filterParameterAdminService';

const FilterParameterList = () => {
  const [filterParameters, setFilterParameters] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('name,asc');

  useEffect(() => {
    const fetchFilterParameters = async () => {
      const data = await getFilterParameters(page, sort, size);
      setFilterParameters(data.content);
      setTotalPages(data.totalPages);
    };
    fetchFilterParameters();
  }, [page, sort, size]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this filter parameter?')) {
      await deleteFilterParameter(id);
      setFilterParameters(filterParameters.filter((fp) => fp.id !== id));
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Filter Parameters</h2>
        <Link to="/admin/filter-parameters/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Add New
        </Link>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('name')}>
              Name
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('type')}>
              Type
            </th>
            <th className="py-2 px-4 border-b">
              Active
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterParameters.map((fp) => (
            <tr key={fp.id}>
              <td className="py-2 px-4 border-b">{fp.name}</td>
              <td className="py-2 px-4 border-b">{fp.type}</td>
              <td className="py-2 px-4 border-b">
                {fp.active ? (
                  <span className="text-green-500 font-bold">Yes</span>
                ) : (
                  <span className="text-red-500">No</span>
                )}
              </td>
              <td className="py-2 px-4 border-b">
                <Link to={`/admin/filter-parameters/${fp.id}`} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(fp.id)}
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

export default FilterParameterList;
