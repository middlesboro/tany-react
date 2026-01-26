import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, deleteOrder } from '../services/orderAdminService';
import { getCarriers } from '../services/carrierAdminService';
import { getPayments } from '../services/paymentAdminService';
import SearchSelect from './SearchSelect';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('id,asc');

  // Data for lookups
  const [carriers, setCarriers] = useState([]);
  const [payments, setPayments] = useState([]);

  // Filter states
  const [filter, setFilter] = useState({
    id: '',
    status: '',
    priceFrom: '',
    priceTo: '',
    carrierId: '',
    paymentId: '',
  });
  const [appliedFilter, setAppliedFilter] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lookups
        const carriersData = await getCarriers(0, 'name,asc', 100);
        setCarriers(carriersData.content);

        const paymentsData = await getPayments(0, 'name,asc', 100);
        setPayments(paymentsData.content);
      } catch (error) {
        console.error('Error fetching lookups:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders(page, sort, size, appliedFilter);
      setOrders(data.content);
      setTotalPages(data.totalPages);
    };
    fetchOrders();
  }, [page, sort, size, appliedFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      await deleteOrder(id);
      setOrders(orders.filter((order) => order.id !== id));
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const handleCarrierChange = (value) => {
    setFilter({
      ...filter,
      carrierId: value,
    });
  };

  const handlePaymentChange = (value) => {
    setFilter({
      ...filter,
      paymentId: value,
    });
  };

  const handleFilterSubmit = () => {
    setAppliedFilter(filter);
    setPage(0);
  };

  const handleClearFilter = () => {
    const emptyFilter = {
      id: '',
      status: '',
      priceFrom: '',
      priceTo: '',
      carrierId: '',
      paymentId: '',
    };
    setFilter(emptyFilter);
    setAppliedFilter({});
    setPage(0);
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-gray-100 p-4 mb-4 rounded shadow">
        <h2 className="text-lg font-bold mb-2">Filter Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-gray-700">Order ID</label>
            <input
              type="text"
              name="id"
              value={filter.id}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Order ID"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Status</label>
            <input
              type="text"
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Status"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Price From</label>
            <input
              type="number"
              name="priceFrom"
              value={filter.priceFrom}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Min Price"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Price To</label>
            <input
              type="number"
              name="priceTo"
              value={filter.priceTo}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Max Price"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <SearchSelect
              label="Carrier"
              options={carriers}
              value={filter.carrierId}
              onChange={handleCarrierChange}
              placeholder="Select Carrier"
            />
          </div>
          <div>
            <SearchSelect
              label="Payment"
              options={payments}
              value={filter.paymentId}
              onChange={handlePaymentChange}
              placeholder="Select Payment"
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
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('id')}>
              Order ID
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('customerName')}>
              Customer
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('status')}>
              Status
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('carrierName')}>
              Carrier
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('paymentName')}>
              Payment
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('finalPrice')}>
              Price
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="py-2 px-4 border-b">{order.orderIdentifier}</td>
              <td className="py-2 px-4 border-b">
                {order.customerName}
              </td>
              <td className="py-2 px-4 border-b">{order.status}</td>
              <td className="py-2 px-4 border-b">
                {order.carrierName}
              </td>
              <td className="py-2 px-4 border-b">
                {order.paymentName}
              </td>
              <td className="py-2 px-4 border-b">{order.finalPrice} €</td>
              <td className="py-2 px-4 border-b">
                <Link
                  to={`/orders/${order.id}`}
                  className="text-blue-500 hover:text-blue-700 mr-2 inline-block"
                  title="View/Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDelete(order.id)}
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

export default OrderList;
