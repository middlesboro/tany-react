import React, { useState } from 'react';
import CustomerList from '../components/CustomerList';
import CustomerForm from '../components/CustomerForm';

const Customers = () => {
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
  };

  const handleSave = () => {
    setCurrentCustomer(null);
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <CustomerForm currentCustomer={currentCustomer} onSave={handleSave} />
        </div>
        <div>
          <CustomerList onEdit={handleEdit} key={refresh} />
        </div>
      </div>
    </div>
  );
};

export default Customers;
