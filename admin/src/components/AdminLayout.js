import React, { useState, useEffect } from 'react';
import { Outlet, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, removeToken, getUserEmail } from '../services/authService';

const menuItems = [
  {
    title: 'Catalog',
    children: [
      { title: 'Products', path: '/products' },
      { title: 'Categories', path: '/categories' },
      { title: 'Brands', path: '/brands' },
      { title: 'Suppliers', path: '/suppliers' },
      { title: 'Product Labels', path: '/product-labels' },
      { title: 'Filter Parameters', path: '/filter-parameters' },
      { title: 'Filter Values', path: '/filter-parameter-values' },
    ]
  },
  {
    title: 'Orders',
    children: [
      { title: 'Orders', path: '/orders' },
      { title: 'Carts', path: '/carts' },
      { title: 'Customers', path: '/customers' },
      { title: 'Wishlists', path: '/wishlists' },
    ]
  },
  {
    title: 'Settings',
    children: [
      { title: 'Shop Settings', path: '/shop-settings' },
      { title: 'Homepage Grids', path: '/homepage-grids' },
      { title: 'Carriers', path: '/carriers' },
      { title: 'Payments', path: '/payments' },
      { title: 'Cart Discounts', path: '/cart-discounts' },
    ]
  },
  {
    title: 'Isklad',
    children: [
      { title: 'Inventory Differences', path: '/isklad/inventory-differences' },
    ]
  },
  {
    title: 'Pages',
    path: '/pages'
  },
  {
    title: 'Blogs',
    path: '/blogs'
  }
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = getUserEmail();
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    const currentPath = location.pathname;
    const newExpanded = {};
    menuItems.forEach(group => {
      if (group.children) {
        const hasActiveChild = group.children.some(child => currentPath.startsWith(child.path));
        if (hasActiveChild) {
          newExpanded[group.title] = true;
        }
      }
    });
    setExpandedGroups(prev => ({ ...prev, ...newExpanded }));
  }, [location.pathname]);

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ message: "Musíte byť prihlásený.", from: location }} replace />;
  }

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const toggleGroup = (title) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="flex min-h-screen">
      <nav className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col justify-between overflow-y-auto sticky top-0 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold mb-4">Admin</h1>
          <ul>
            {menuItems.map((item) => (
              <li key={item.title} className="mb-2">
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleGroup(item.title)}
                      className="flex justify-between items-center w-full text-left hover:text-gray-300 focus:outline-none py-1"
                    >
                      <span className="font-semibold">{item.title}</span>
                      <span>{expandedGroups[item.title] ? '−' : '+'}</span>
                    </button>
                    {expandedGroups[item.title] && (
                      <ul className="pl-4 mt-2 border-l border-gray-600">
                        {item.children.map((child) => (
                          <li key={child.path} className="mb-2 last:mb-0">
                            <Link
                              to={child.path}
                              className={`block hover:text-gray-300 ${location.pathname.startsWith(child.path) ? 'text-blue-400 font-bold' : ''}`}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`block font-semibold hover:text-gray-300 py-1 ${location.pathname.startsWith(item.path) ? 'text-blue-400 font-bold' : ''}`}
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
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
