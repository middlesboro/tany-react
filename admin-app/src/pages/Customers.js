import React from 'react';
import { Link } from 'react-router-dom';
import CustomerList from '../components/CustomerList';

const Customers = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <Link to="/admin/customers/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Customer
        </Link>
      </div>
      <CustomerList />
    </div>
  );
};

export default Customers;
