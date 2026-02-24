import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, deleteCategory } from '../services/categoryAdminService';
import usePersistentTableState from '../hooks/usePersistentTableState';

const CategoryList = () => {
  const {
    page, setPage,
    size, setSize,
    sort, handleSort,
    filter, handleFilterChange,
    appliedFilter,
    handleFilterSubmit, handleClearFilter
  } = usePersistentTableState('admin_categories_list_state', {
    query: '',
  }, 'title,asc');

  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories(page, sort, size, appliedFilter);
      setCategories(data.content);
      setTotalPages(data.totalPages);
    };
    fetchCategories();
  }, [page, sort, size, appliedFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
    }
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

        <div className="flex gap-4 items-end">
          <div className="flex-grow">
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input
              type="text"
              name="query"
              value={filter.query}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Search by title..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-ps-primary focus:border-ps-primary"
            />
          </div>
          <div className="flex gap-2">
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
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
         <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-700">
               Category List
               <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{categories.length} / {size * totalPages}</span>
            </h3>
         </div>

         <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('title')}>
                   <div className="flex items-center gap-1">Title {sort.startsWith('title') && (sort.endsWith('desc') ? '▼' : '▲')}</div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{category.title}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/categories/${category.id}`}
                          className="text-gray-500 hover:text-ps-primary hover:bg-gray-100 p-1.5 rounded transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-gray-500 hover:text-red-600 hover:bg-gray-100 p-1.5 rounded transition-colors"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                    </div>
                  </td>
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

export default CategoryList;
