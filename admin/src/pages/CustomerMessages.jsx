import React from 'react';
import CustomerMessageList from '../components/CustomerMessageList';

const CustomerMessages = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customer Messages</h1>
      </div>
      <CustomerMessageList />
    </div>
  );
};

export default CustomerMessages;
