import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCarts } from '../services/cartAdminService';

const CartList = () => {
  const [carts, setCarts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('createDate,desc');

  // Filter states
  const [filter, setFilter] = useState({
    cartId: '',
    orderIdentifier: '',
    customerName: '',
    dateFrom: '',
    dateTo: '',
  });
  const [appliedFilter, setAppliedFilter] = useState({});

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const data = await getCarts(page, sort, size, appliedFilter);
        setCarts(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error('Error fetching carts:', error);
      }
    };
    fetchCarts();
  }, [page, sort, size, appliedFilter]);

  const handleSort = (field) => {
    const [currentField, currentDirection] = sort.split(',');
    if (currentField === field) {
      setSort(`${field},${currentDirection === 'asc' ? 'desc' : 'asc'}`);
    } else {
      setSort(`${field},asc`);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const handleFilterSubmit = () => {
    setAppliedFilter(filter);
    setPage(0);
  };

  const handleClearFilter = () => {
    const emptyFilter = {
      cartId: '',
      orderIdentifier: '',
      customerName: '',
      dateFrom: '',
      dateTo: '',
    };
    setFilter(emptyFilter);
    setAppliedFilter({});
    setPage(0);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cart List</h2>

      {/* Filter Section */}
      <div className="bg-gray-100 p-4 mb-4 rounded shadow">
        <h3 className="text-lg font-bold mb-2">Filter Carts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700">Cart ID</label>
            <input
              type="text"
              name="cartId"
              value={filter.cartId}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Cart ID"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Order ID</label>
            <input
              type="text"
              name="orderIdentifier"
              value={filter.orderIdentifier}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Order Identifier"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={filter.customerName}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Customer Name"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Date From</label>
            <input
              type="date"
              name="dateFrom"
              value={filter.dateFrom}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Date To</label>
            <input
              type="date"
              name="dateTo"
              value={filter.dateTo}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleFilterSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Filter
          </button>
          <button
            onClick={handleClearFilter}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => handleSort('cartId')}>
              Cart ID {sort.startsWith('cartId') && (sort.endsWith('asc') ? '▲' : '▼')}
            </th>
            <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => handleSort('orderIdentifier')}>
              Order ID {sort.startsWith('orderIdentifier') && (sort.endsWith('asc') ? '▲' : '▼')}
            </th>
            <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => handleSort('customerName')}>
              Customer {sort.startsWith('customerName') && (sort.endsWith('asc') ? '▲' : '▼')}
            </th>
             <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => handleSort('price')}>
              Price {sort.startsWith('price') && (sort.endsWith('asc') ? '▲' : '▼')}
            </th>
             <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => handleSort('carrierName')}>
              Carrier {sort.startsWith('carrierName') && (sort.endsWith('asc') ? '▲' : '▼')}
            </th>
             <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => handleSort('paymentName')}>
              Payment {sort.startsWith('paymentName') && (sort.endsWith('asc') ? '▲' : '▼')}
            </th>
            <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => handleSort('createDate')}>
              Created At {sort.startsWith('createDate') && (sort.endsWith('asc') ? '▲' : '▼')}
            </th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {carts.map((cart) => (
            <tr key={cart.cartId}>
              <td className="py-2 px-4 border-b">{cart.cartId}</td>
              <td className="py-2 px-4 border-b">{cart.orderIdentifier || '-'}</td>
              <td className="py-2 px-4 border-b">{cart.customerName || '-'}</td>
              <td className="py-2 px-4 border-b">{cart.price ? `${cart.price} €` : '-'}</td>
              <td className="py-2 px-4 border-b">{cart.carrierName || '-'}</td>
              <td className="py-2 px-4 border-b">{cart.paymentName || '-'}</td>
              <td className="py-2 px-4 border-b">
                {cart.createDate ? new Date(cart.createDate).toLocaleString('sk-SK') : '-'}
              </td>
              <td className="py-2 px-4 border-b">
                <Link
                  to={`/carts/${cart.cartId}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                >
                  Detail
                </Link>
              </td>
            </tr>
          ))}
          {carts.length === 0 && (
            <tr>
              <td colSpan="8" className="py-4 text-center">No carts found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
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
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mr-2">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page + 1 >= totalPages}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartList;
