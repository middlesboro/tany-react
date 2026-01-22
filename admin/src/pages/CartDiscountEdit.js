import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createCartDiscount, getCartDiscount, updateCartDiscount } from '../services/cartDiscountAdminService';

const CartDiscountEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    discountType: 'PERCENTAGE',
    value: '',
    freeShipping: false,
    dateFrom: '',
    dateTo: '',
    active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      getCartDiscount(id)
        .then((data) => {
          // Format dates for datetime-local input
          const formatDate = (dateString) => {
            if (!dateString) return '';
            return new Date(dateString).toISOString().slice(0, 16);
          };

          setFormData({
            ...data,
            dateFrom: formatDate(data.dateFrom),
            dateTo: formatDate(data.dateTo),
          });
        })
        .catch((err) => setError('Failed to fetch discount details'))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert dates to Instant format (ISO string)
      const payload = {
        ...formData,
        dateFrom: formData.dateFrom ? new Date(formData.dateFrom).toISOString() : null,
        dateTo: formData.dateTo ? new Date(formData.dateTo).toISOString() : null,
      };

      if (isNew) {
        await createCartDiscount(payload);
      } else {
        await updateCartDiscount(id, payload);
      }
      navigate('/admin/cart-discounts');
    } catch (err) {
      setError('Failed to save discount');
      setLoading(false);
    }
  };

  if (loading && !isNew) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to="/admin/cart-discounts" className="text-blue-500 hover:underline">
          &larr; Back to Discounts
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">{isNew ? 'Create Cart Discount' : 'Edit Cart Discount'}</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Type</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED_AMOUNT">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              required
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="freeShipping"
            checked={formData.freeShipping}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Free Shipping</label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date From</label>
            <input
              type="datetime-local"
              name="dateFrom"
              value={formData.dateFrom}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date To</label>
            <input
              type="datetime-local"
              name="dateTo"
              value={formData.dateTo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Active</label>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Discount'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CartDiscountEdit;
