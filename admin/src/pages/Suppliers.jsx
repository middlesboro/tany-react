import React from 'react';
import { Link } from 'react-router-dom';
import SupplierList from '../components/SupplierList';

const Suppliers = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Supplier Management</h1>
        <Link to="/suppliers/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Supplier
        </Link>
      </div>
      <SupplierList />
    </div>
  );
};

export default Suppliers;
