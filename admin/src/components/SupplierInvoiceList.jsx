import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSupplierInvoices, deleteSupplierInvoice, exportSupplierInvoicesCsv, updateSupplierInvoice } from '../services/supplierInvoiceAdminService';
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
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

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

  const handleEditClick = (invoice) => {
    setEditingId(invoice.id);
    setEditFormData({
      supplierName: invoice.supplierName || '',
      priceWithVat: invoice.priceWithVat || '',
      priceWithoutVat: invoice.priceWithoutVat || '',
      vatValue: invoice.vatValue || '',
      dateCreated: invoice.dateCreated ? invoice.dateCreated.slice(0, 10) : '',
      supplierVatIdentifier: invoice.supplierVatIdentifier || '',
      taxDate: invoice.taxDate ? invoice.taxDate.slice(0, 10) : '',
      invoiceNumber: invoice.invoiceNumber || '',
      paymentReference: invoice.paymentReference || '',
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveClick = async (id) => {
    try {
      const updatedInvoice = await updateSupplierInvoice(id, editFormData);
      setInvoices(invoices.map((inv) => (inv.id === id ? updatedInvoice : inv)));
      setEditingId(null);
      setEditFormData({});
    } catch (error) {
      alert('Failed to update: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
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
              type="date"
              name="createDateFrom"
              value={filter.createDateFrom || ''}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Date To</label>
            <input
              type="date"
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded text-sm">
          <thead>
            <tr>
              <th className="py-2 px-2 border-b text-left">ID</th>
              <th className="py-2 px-2 border-b cursor-pointer text-left" onClick={() => handleSort('createDate')}>Create Date</th>
              <th className="py-2 px-2 border-b cursor-pointer text-left" onClick={() => handleSort('supplierName')}>Supplier Name</th>
              <th className="py-2 px-2 border-b cursor-pointer text-left" onClick={() => handleSort('supplierVatIdentifier')}>VAT ID</th>
              <th className="py-2 px-2 border-b cursor-pointer text-left" onClick={() => handleSort('invoiceNumber')}>Invoice Number</th>
              <th className="py-2 px-2 border-b cursor-pointer text-left" onClick={() => handleSort('paymentReference')}>Payment Ref</th>
              <th className="py-2 px-2 border-b cursor-pointer text-right" onClick={() => handleSort('priceWithoutVat')}>Price w/o VAT</th>
              <th className="py-2 px-2 border-b cursor-pointer text-right" onClick={() => handleSort('vatValue')}>VAT Value</th>
              <th className="py-2 px-2 border-b cursor-pointer text-right" onClick={() => handleSort('priceWithVat')}>Price With VAT</th>
              <th className="py-2 px-2 border-b cursor-pointer text-left" onClick={() => handleSort('dateCreated')}>Date Created</th>
              <th className="py-2 px-2 border-b cursor-pointer text-left" onClick={() => handleSort('taxDate')}>Tax Date</th>
              <th className="py-2 px-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                {editingId === invoice.id ? (
                  <>
                    <td className="py-2 px-2 border-b text-gray-500 font-mono text-xs truncate max-w-[80px]" title={invoice.id}>{invoice.id}</td>
                    <td className="py-2 px-2 border-b text-gray-500 whitespace-nowrap">{invoice.createDate ? new Date(invoice.createDate).toLocaleString() : ''}</td>
                    <td className="py-2 px-2 border-b">
                      <input type="text" name="supplierName" value={editFormData.supplierName} onChange={handleInputChange} className="w-full px-1 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-2 px-2 border-b">
                      <input type="text" name="supplierVatIdentifier" value={editFormData.supplierVatIdentifier} onChange={handleInputChange} className="w-full px-1 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-2 px-2 border-b">
                      <input type="text" name="invoiceNumber" value={editFormData.invoiceNumber} onChange={handleInputChange} className="w-full px-1 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-2 px-2 border-b">
                      <input type="text" name="paymentReference" value={editFormData.paymentReference} onChange={handleInputChange} className="w-full px-1 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-2 px-2 border-b">
                      <input type="number" step="0.01" name="priceWithoutVat" value={editFormData.priceWithoutVat} onChange={handleInputChange} className="w-full px-1 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-2 px-2 border-b">
                      <input type="number" step="0.01" name="vatValue" value={editFormData.vatValue} onChange={handleInputChange} className="w-full px-1 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-2 px-2 border-b">
                      <input type="number" step="0.01" name="priceWithVat" value={editFormData.priceWithVat} onChange={handleInputChange} className="w-full px-1 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-2 px-2 border-b">
                      <input type="date" name="dateCreated" value={editFormData.dateCreated} onChange={handleInputChange} className="w-full px-1 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-2 px-2 border-b">
                      <input type="date" name="taxDate" value={editFormData.taxDate} onChange={handleInputChange} className="w-full px-1 py-1 border rounded text-xs" />
                    </td>
                    <td className="py-2 px-2 border-b text-center whitespace-nowrap">
                      <button onClick={() => handleSaveClick(invoice.id)} className="text-green-600 hover:text-green-800 mr-2" title="Save">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button onClick={handleCancelClick} className="text-gray-500 hover:text-gray-700" title="Cancel">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-2 border-b text-gray-500 font-mono text-xs truncate max-w-[80px]" title={invoice.id}>{invoice.id}</td>
                    <td className="py-2 px-2 border-b whitespace-nowrap">{invoice.createDate ? new Date(invoice.createDate).toLocaleString() : ''}</td>
                    <td className="py-2 px-2 border-b">{invoice.supplierName}</td>
                    <td className="py-2 px-2 border-b">{invoice.supplierVatIdentifier}</td>
                    <td className="py-2 px-2 border-b">{invoice.invoiceNumber}</td>
                    <td className="py-2 px-2 border-b">{invoice.paymentReference}</td>
                    <td className="py-2 px-2 border-b text-right">{invoice.priceWithoutVat}</td>
                    <td className="py-2 px-2 border-b text-right">{invoice.vatValue}</td>
                    <td className="py-2 px-2 border-b text-right">{invoice.priceWithVat}</td>
                    <td className="py-2 px-2 border-b whitespace-nowrap">{invoice.dateCreated ? new Date(invoice.dateCreated).toLocaleDateString() : ''}</td>
                    <td className="py-2 px-2 border-b whitespace-nowrap">{invoice.taxDate ? new Date(invoice.taxDate).toLocaleDateString() : ''}</td>
                    <td className="py-2 px-2 border-b text-center whitespace-nowrap">
                      <Link to={`/supplier-invoices/${invoice.id}`} className="text-blue-500 hover:text-blue-700 mr-2 inline-block" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                      <button onClick={() => handleEditClick(invoice)} className="text-yellow-500 hover:text-yellow-700 mr-2 inline-block" title="Quick Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(invoice.id)} className="text-red-500 hover:text-red-700 inline-block" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
