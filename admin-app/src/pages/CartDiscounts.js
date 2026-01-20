import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCartDiscounts, deleteCartDiscount } from '../services/cartDiscountAdminService';

const CartDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 20;

  useEffect(() => {
    fetchDiscounts();
  }, [page]);

  const fetchDiscounts = async () => {
    try {
      const data = await getCartDiscounts(page, 'title,asc', size);
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

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cart Discounts</h1>
        <Link to="/admin/cart-discounts/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add New Discount
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
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
                  <Link to={`/admin/cart-discounts/${discount.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(discount.id)} className="text-red-600 hover:text-red-900">
                    Delete
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

      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className={`px-4 py-2 border rounded ${page === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
            className={`px-4 py-2 border rounded ${page === totalPages - 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CartDiscounts;
