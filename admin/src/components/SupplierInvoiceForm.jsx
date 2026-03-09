import React from 'react';

const SupplierInvoiceForm = ({ invoice, handleChange, handleSubmit, handleSaveAndStay }) => {
  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Supplier Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="supplierName"
            value={invoice.supplierName || ''}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Supplier VAT Identifier
          </label>
          <input
            type="text"
            name="supplierVatIdentifier"
            value={invoice.supplierVatIdentifier || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Invoice Number
          </label>
          <input
            type="text"
            name="invoiceNumber"
            value={invoice.invoiceNumber || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Payment Reference
          </label>
          <input
            type="text"
            name="paymentReference"
            value={invoice.paymentReference || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Price Without VAT
          </label>
          <input
            type="number"
            step="0.01"
            name="priceWithoutVat"
            value={invoice.priceWithoutVat || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            VAT Value
          </label>
          <input
            type="number"
            step="0.01"
            name="vatValue"
            value={invoice.vatValue || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Price With VAT
          </label>
          <input
            type="number"
            step="0.01"
            name="priceWithVat"
            value={invoice.priceWithVat || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date Created
          </label>
          <input
            type="date"
            name="dateCreated"
            value={invoice.dateCreated ? invoice.dateCreated.slice(0, 10) : ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tax Date
          </label>
          <input
            type="date"
            name="taxDate"
            value={invoice.taxDate ? invoice.taxDate.slice(0, 10) : ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleSaveAndStay}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save and Stay
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierInvoiceForm;
