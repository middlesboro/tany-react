import React from 'react';
import { Link } from 'react-router-dom';
import CustomerEmailList from '../components/CustomerEmailList';

const CustomerEmails = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Emails</h1>
        <Link to="/customer-emails/new" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Add Customer Email
        </Link>
      </div>
      <CustomerEmailList />
    </div>
  );
};

export default CustomerEmails;
