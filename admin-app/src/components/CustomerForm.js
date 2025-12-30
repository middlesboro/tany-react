import React from 'react';

const CustomerForm = ({ customer, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">First Name</label>
        <input
          type="text"
          name="firstname"
          value={customer.firstname}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Last Name</label>
        <input
          type="text"
          name="lastname"
          value={customer.lastname}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={customer.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={customer.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
};

export default CustomerForm;
