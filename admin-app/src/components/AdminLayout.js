import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex">
      <nav className="w-64 h-screen bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
        <ul>
          <li className="mb-2">
            <Link to="/admin/products" className="hover:text-gray-300">Products</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/categories" className="hover:text-gray-300">Categories</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/customers" className="hover:text-gray-300">Customers</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/carts" className="hover:text-gray-300">Carts</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/orders" className="hover:text-gray-300">Orders</Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
