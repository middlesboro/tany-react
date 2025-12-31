import React from 'react';
import { Outlet, Link, Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken, getUserEmail } from '../services/authService';

const AdminLayout = () => {
  const navigate = useNavigate();
  const userEmail = getUserEmail();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div className="flex">
      <nav className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col justify-between">
        <div>
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
        </div>
        <div>
          {userEmail && (
            <div className="mb-2 text-sm text-gray-400 break-words">
              {userEmail}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
