import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getContentSnippets, deleteContentSnippet } from '../services/contentSnippetAdminService';
import usePersistentTableState from '../hooks/usePersistentTableState';

const ContentSnippetList = () => {
  const [contentSnippets, setContentSnippets] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const {
    page, setPage,
    sort, setSort,
    size, setSize,
    filter, setFilter,
    appliedFilter, setAppliedFilter
  } = usePersistentTableState('contentSnippetsList');

  const fetchContentSnippets = useCallback(async () => {
    try {
      const data = await getContentSnippets(page, sort, size);
      setContentSnippets(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch content snippets:', error);
    }
  }, [page, sort, size, appliedFilter]);

  useEffect(() => {
    fetchContentSnippets();
  }, [fetchContentSnippets]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content snippet?')) {
      await deleteContentSnippet(id);
      fetchContentSnippets();
    }
  };

  const handleSort = (column) => {
    const [currentColumn, currentDirection] = sort.split(',');
    if (currentColumn === column) {
      setSort(`${column},${currentDirection === 'asc' ? 'desc' : 'asc'}`);
    } else {
      setSort(`${column},asc`);
    }
  };

  const getSortIndicator = (column) => {
    const [currentColumn, currentDirection] = sort.split(',');
    if (currentColumn === column) {
      return currentDirection === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setAppliedFilter(filter);
    setPage(0);
  };

  const handleFilterReset = () => {
    setFilter({});
    setAppliedFilter({});
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('id')}>
                UUID {getSortIndicator('id')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('name')}>
                Name {getSortIndicator('name')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('placeholder')}>
                Placeholder {getSortIndicator('placeholder')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('createDate')}>
                Create Date {getSortIndicator('createDate')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('updateDate')}>
                Update Date {getSortIndicator('updateDate')}
              </th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-2 font-normal"></th>
              <th className="px-4 py-2 font-normal"></th>
              <th className="px-4 py-2 font-normal"></th>
              <th className="px-4 py-2 font-normal"></th>
              <th className="px-4 py-2 font-normal"></th>
              <th className="px-4 py-2 text-right">
                <div className="flex justify-end gap-2">
                   {/* Removed filter submit/reset actions as there are no inputs yet */}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {contentSnippets.map((snippet) => (
              <tr key={snippet.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-500">{snippet.id}</td>
                <td className="px-4 py-2">{snippet.name}</td>
                <td className="px-4 py-2">{snippet.placeholder}</td>
                <td className="px-4 py-2">{snippet.createDate ? new Date(snippet.createDate).toLocaleString() : ''}</td>
                <td className="px-4 py-2">{snippet.updateDate ? new Date(snippet.updateDate).toLocaleString() : ''}</td>
                <td className="px-4 py-2 text-right">
                  <Link
                    to={`/content-snippets/${snippet.id}`}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(snippet.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {contentSnippets.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                  No content snippets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ps-primary"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page + 1} of {Math.max(1, totalPages)}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentSnippetList;
