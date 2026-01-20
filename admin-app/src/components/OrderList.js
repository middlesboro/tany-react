import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, deleteOrder } from '../services/orderAdminService';
import { getCustomers } from '../services/customerAdminService';
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
  const [customers, setCustomers] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [payments, setPayments] = useState([]);

  // Filter states
  const [filter, setFilter] = useState({
    id: '',
    status: '',
    priceFrom: '',
    priceTo: '',
    customerId: '',
  });
  const [appliedFilter, setAppliedFilter] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lookups
        const customersData = await getCustomers(0, 'lastname,asc', 1000);
        setCustomers(customersData.content.map(c => ({
          id: c.id,
          name: `${c.firstname} ${c.lastname} (${c.email})`
        })));

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

  const handleCustomerChange = (value) => {
    setFilter({
      ...filter,
      customerId: value,
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
      customerId: '',
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
              label="Customer"
              options={customers}
              value={filter.customerId}
              onChange={handleCustomerChange}
              placeholder="Select Customer"
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
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('customerId')}>
              Customer
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('status')}>
              Status
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('carrierId')}>
              Carrier
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('paymentId')}>
              Payment
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('finalPrice')}>
              Final Price
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="py-2 px-4 border-b">{order.id}</td>
              <td className="py-2 px-4 border-b">
                {customers.find(c => c.id === order.customerId)?.name || order.customerId}
              </td>
              <td className="py-2 px-4 border-b">{order.status}</td>
              <td className="py-2 px-4 border-b">
                {carriers.find(c => c.id === order.carrierId)?.name || order.carrierId}
              </td>
              <td className="py-2 px-4 border-b">
                {payments.find(p => p.id === order.paymentId)?.name || order.paymentId}
              </td>
              <td className="py-2 px-4 border-b">{order.finalPrice}</td>
              <td className="py-2 px-4 border-b">
                <Link to={`/admin/orders/${order.id}`} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  View/Edit
                </Link>
                <button
                  onClick={() => handleDelete(order.id)}
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

export default OrderList;
