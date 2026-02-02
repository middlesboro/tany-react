import React from 'react';

const CustomerForm = ({ customer, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      {customer.id && (
        <div className="mb-4">
          <label className="block text-gray-700">ID</label>
          <input
            type="text"
            value={customer.id}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="firstname" className="block text-gray-700">First Name</label>
        <input
          id="firstname"
          type="text"
          name="firstname"
          value={customer.firstname}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="lastname" className="block text-gray-700">Last Name</label>
        <input
          id="lastname"
          type="text"
          name="lastname"
          value={customer.lastname}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={customer.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={customer.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="role" className="block text-gray-700">Role</label>
        <select
          id="role"
          name="role"
          value={customer.role || 'CUSTOMER'}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      <h3 className="text-xl font-bold mb-2 mt-6">Invoice Address</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
            <label htmlFor="invoiceAddress.street" className="block text-gray-700">Street</label>
            <input
            id="invoiceAddress.street"
            type="text"
            name="invoiceAddress.street"
            value={customer.invoiceAddress?.street || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            />
        </div>
        <div className="mb-4">
            <label htmlFor="invoiceAddress.city" className="block text-gray-700">City</label>
            <input
            id="invoiceAddress.city"
            type="text"
            name="invoiceAddress.city"
            value={customer.invoiceAddress?.city || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            />
        </div>
        <div className="mb-4">
            <label htmlFor="invoiceAddress.zip" className="block text-gray-700">Zip</label>
            <input
            id="invoiceAddress.zip"
            type="text"
            name="invoiceAddress.zip"
            value={customer.invoiceAddress?.zip || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            />
        </div>
        <div className="mb-4">
            <label htmlFor="invoiceAddress.country" className="block text-gray-700">Country</label>
            <input
            id="invoiceAddress.country"
            type="text"
            name="invoiceAddress.country"
            value={customer.invoiceAddress?.country || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2 mt-6">Delivery Address</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
            <label htmlFor="deliveryAddress.street" className="block text-gray-700">Street</label>
            <input
            id="deliveryAddress.street"
            type="text"
            name="deliveryAddress.street"
            value={customer.deliveryAddress?.street || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            />
        </div>
        <div className="mb-4">
            <label htmlFor="deliveryAddress.city" className="block text-gray-700">City</label>
            <input
            id="deliveryAddress.city"
            type="text"
            name="deliveryAddress.city"
            value={customer.deliveryAddress?.city || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            />
        </div>
        <div className="mb-4">
            <label htmlFor="deliveryAddress.zip" className="block text-gray-700">Zip</label>
            <input
            id="deliveryAddress.zip"
            type="text"
            name="deliveryAddress.zip"
            value={customer.deliveryAddress?.zip || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            />
        </div>
        <div className="mb-4">
            <label htmlFor="deliveryAddress.country" className="block text-gray-700">Country</label>
            <input
            id="deliveryAddress.country"
            type="text"
            name="deliveryAddress.country"
            value={customer.deliveryAddress?.country || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            />
        </div>
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        Save
      </button>
    </form>
  );
};

export default CustomerForm;
