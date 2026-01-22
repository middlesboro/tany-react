import React from 'react';
import { Link } from 'react-router-dom';
import OrderList from '../components/OrderList';

const Orders = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <Link to="/orders/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Order
        </Link>
      </div>
      <OrderList />
    </div>
  );
};

export default Orders;
