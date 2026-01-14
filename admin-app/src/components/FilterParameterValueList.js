import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFilterParameterValues, deleteFilterParameterValue } from '../services/filterParameterValueAdminService';

const FilterParameterValueList = () => {
  const [values, setValues] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('name,asc');

  useEffect(() => {
    const fetchValues = async () => {
      const data = await getFilterParameterValues(page, sort, size);
      setValues(data.content);
      setTotalPages(data.totalPages);
    };
    fetchValues();
  }, [page, sort, size]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this filter value?')) {
      await deleteFilterParameterValue(id);
      setValues(values.filter((v) => v.id !== id));
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
        <h2 className="text-2xl font-bold">Filter Parameter Values</h2>
        <Link to="/admin/filter-parameter-values/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Add New
        </Link>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('name')}>
              Name
            </th>
            <th className="py-2 px-4 border-b">
              Active
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {values.map((val) => (
            <tr key={val.id}>
              <td className="py-2 px-4 border-b">{val.name}</td>
              <td className="py-2 px-4 border-b">
                {val.active ? (
                  <span className="text-green-500 font-bold">Yes</span>
                ) : (
                  <span className="text-red-500">No</span>
                )}
              </td>
              <td className="py-2 px-4 border-b">
                <Link to={`/admin/filter-parameter-values/${val.id}`} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(val.id)}
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

export default FilterParameterValueList;
