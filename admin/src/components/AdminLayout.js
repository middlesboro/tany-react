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

  const [isPinned, setIsPinned] = useState(() => {
    const saved = localStorage.getItem('admin_sidebar_pinned');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    localStorage.setItem('admin_sidebar_pinned', JSON.stringify(isPinned));
  }, [isPinned]);

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

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  const isSidebarVisible = isPinned || isHovered;

  return (
    <div className="flex min-h-screen relative">
      {!isPinned && (
        <div
          className="fixed top-0 left-0 w-4 h-full z-40"
          onMouseEnter={() => setIsHovered(true)}
        />
      )}
      <nav
        className={`bg-gray-800 text-white p-4 flex flex-col justify-between overflow-y-auto transition-all duration-300 ease-in-out h-screen top-0 flex-shrink-0
        ${isPinned ? 'sticky w-64' : 'fixed left-0 z-50 w-64 shadow-2xl'}
        ${!isPinned && !isSidebarVisible ? '-translate-x-full' : 'translate-x-0'}`}
        onMouseEnter={() => !isPinned && setIsHovered(true)}
        onMouseLeave={() => !isPinned && setIsHovered(false)}
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Admin</h1>
            <button
              onClick={togglePin}
              className="text-gray-400 hover:text-white focus:outline-none p-1 rounded hover:bg-gray-700"
              title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
            >
              {isPinned ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              )}
            </button>
          </div>
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
