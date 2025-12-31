import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, deleteOrder } from '../services/orderAdminService';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('id,asc');

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders(page, sort, size);
      setOrders(data.content);
      setTotalPages(data.totalPages);
    };
    fetchOrders();
  }, [page, sort, size]);

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

  return (
    <div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('id')}>
              Order ID
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('finalPrice')}>
              Final Price
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('customerId')}>
              Customer ID
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="py-2 px-4 border-b">{order.id}</td>
              <td className="py-2 px-4 border-b">{order.finalPrice}</td>
              <td className="py-2 px-4 border-b">{order.customerId}</td>
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
