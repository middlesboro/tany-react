import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCartDiscounts, deleteCartDiscount } from '../services/cartDiscountAdminService';
import usePersistentTableState from '../hooks/usePersistentTableState';

const CartDiscounts = () => {
  const {
    page, setPage,
    size, setSize,
    sort, handleSort
  } = usePersistentTableState('admin_cart_discounts_list_state', {}, 'title,asc', 20);

  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchDiscounts();
  }, [page, size, sort]);

  const fetchDiscounts = async () => {
    try {
      const data = await getCartDiscounts(page, sort, size);
      if (data.content) {
        setDiscounts(data.content);
        setTotalPages(data.totalPages);
      } else {
        setDiscounts([]);
      }
    } catch (error) {
      console.error('Failed to fetch discounts', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        await deleteCartDiscount(id);
        fetchDiscounts();
      } catch (error) {
        console.error('Failed to delete discount', error);
      }
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cart Discounts</h1>
        <Link to="/cart-discounts/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add New Discount
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('title')}>Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('code')}>Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('discountType')}>Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('value')}>Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('active')}>Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {discounts.map((discount) => (
              <tr key={discount.id}>
                <td className="px-6 py-4 whitespace-nowrap">{discount.title}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono">{discount.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{discount.discountType}</td>
                <td className="px-6 py-4 whitespace-nowrap">{discount.value}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {discount.active ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/cart-discounts/${discount.id}`}
                    className="text-blue-500 hover:text-blue-700 mr-2 inline-block"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(discount.id)}
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
            {discounts.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No discounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
            <option value={20}>20</option>
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

export default CartDiscounts;
