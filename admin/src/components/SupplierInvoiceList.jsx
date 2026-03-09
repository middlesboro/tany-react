import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSupplierInvoices, deleteSupplierInvoice, exportSupplierInvoicesCsv } from '../services/supplierInvoiceAdminService';
import usePersistentTableState from '../hooks/usePersistentTableState';

const SupplierInvoiceList = () => {
  const {
    page, setPage,
    size, setSize,
    sort, handleSort,
    filter, setFilter, handleFilterChange,
    appliedFilter,
    handleFilterSubmit, handleClearFilter
  } = usePersistentTableState('admin_supplier_invoices_list_state', {
    query: '',
    createDateFrom: '',
    createDateTo: '',
  }, 'id,desc');

  const [invoices, setInvoices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let ignore = false;
    const fetchInvoices = async () => {
      try {
        const data = await getSupplierInvoices(page, sort, size, appliedFilter.query, appliedFilter.createDateFrom, appliedFilter.createDateTo);
        if (!ignore) {
          setInvoices(data.content);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching supplier invoices:', error);
      }
    };
    fetchInvoices();
    return () => { ignore = true; };
  }, [page, sort, size, appliedFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier invoice?')) {
      try {
        await deleteSupplierInvoice(id);
        setInvoices(invoices.filter((inv) => inv.id !== id));
      } catch (error) {
        alert('Failed to delete: ' + error.message);
      }
    }
  };

  const handleExportCsv = async () => {
    try {
      await exportSupplierInvoicesCsv(appliedFilter.createDateFrom, appliedFilter.createDateTo);
    } catch (error) {
      alert('Failed to export CSV: ' + error.message);
    }
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-gray-100 p-4 mb-4 rounded shadow">
        <h2 className="text-lg font-bold mb-2">Filter Invoices</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700">Search</label>
            <input
              type="text"
              name="query"
              value={filter.query || ''}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
              placeholder="Search..."
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Date From</label>
            <input
              type="datetime-local"
              name="createDateFrom"
              value={filter.createDateFrom || ''}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Date To</label>
            <input
              type="datetime-local"
              name="createDateTo"
              value={filter.createDateTo || ''}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <div className="flex gap-2">
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
          <button
            onClick={handleExportCsv}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer text-left" onClick={() => handleSort('supplierName')}>
              Supplier Name
            </th>
            <th className="py-2 px-4 border-b cursor-pointer text-left" onClick={() => handleSort('invoiceNumber')}>
              Invoice Number
            </th>
            <th className="py-2 px-4 border-b cursor-pointer text-left" onClick={() => handleSort('dateCreated')}>
              Date Created
            </th>
            <th className="py-2 px-4 border-b cursor-pointer text-right" onClick={() => handleSort('priceWithVat')}>
              Price With VAT
            </th>
            <th className="py-2 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="py-2 px-4 border-b">{invoice.supplierName}</td>
              <td className="py-2 px-4 border-b">{invoice.invoiceNumber}</td>
              <td className="py-2 px-4 border-b">{invoice.dateCreated ? new Date(invoice.dateCreated).toLocaleString() : ''}</td>
              <td className="py-2 px-4 border-b text-right">{invoice.priceWithVat}</td>
              <td className="py-2 px-4 border-b text-center">
                <Link
                  to={`/supplier-invoices/${invoice.id}`}
                  className="text-blue-500 hover:text-blue-700 mr-2 inline-block"
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="text-red-500 hover:text-red-700 inline-block"
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

export default SupplierInvoiceList;
