import React from 'react';
import { Link } from 'react-router-dom';
import SupplierInvoiceList from '../components/SupplierInvoiceList';

const SupplierInvoices = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Supplier Invoices Management</h1>
        <Link to="/supplier-invoices/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Supplier Invoice
        </Link>
      </div>
      <SupplierInvoiceList />
    </div>
  );
};

export default SupplierInvoices;
