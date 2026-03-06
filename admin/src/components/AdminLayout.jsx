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
      { title: 'Customer Messages', path: '/customer-messages' },
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
    title: 'Emails',
    children: [
      { title: 'Customer Emails', path: '/customer-emails' },
      { title: 'Email Campaigns', path: '/email-campaigns' },
      { title: 'Email Templates', path: '/email-templates' },
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
    <div className="flex min-h-screen relative bg-ps-content-bg font-sans text-ps-text">
      {!isPinned && (
        <div
          className="fixed top-0 left-0 w-4 h-full z-40"
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`bg-ps-sidebar text-gray-400 flex flex-col justify-between overflow-y-auto transition-all duration-300 ease-in-out h-screen top-0 flex-shrink-0 border-r border-gray-800
        ${isPinned ? 'sticky w-64' : 'fixed left-0 z-50 w-64 shadow-2xl'}
        ${!isPinned && !isSidebarVisible ? '-translate-x-full' : 'translate-x-0'}`}
        onMouseEnter={() => !isPinned && setIsHovered(true)}
        onMouseLeave={() => !isPinned && setIsHovered(false)}
      >
        <div>
          <div className="h-16 flex items-center justify-center bg-gray-900 shadow-md mb-4 px-4">
             <h1 className="text-xl font-bold text-white tracking-wider uppercase">Admin</h1>
          </div>

          <ul className="px-2">
            {menuItems.map((item) => (
              <li key={item.title} className="mb-1">
                {item.children ? (
                  <div className="rounded overflow-hidden">
                    <button
                      onClick={() => toggleGroup(item.title)}
                      className={`flex justify-between items-center w-full text-left px-3 py-2 text-sm font-medium focus:outline-none transition-colors duration-200
                        ${expandedGroups[item.title] ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-gray-200'}`}
                    >
                      <span className="flex items-center gap-2">
                         {/* Placeholder icon */}
                         <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                         {item.title}
                      </span>
                      <span className="text-xs">{expandedGroups[item.title] ? '▲' : '▼'}</span>
                    </button>
                    {expandedGroups[item.title] && (
                      <ul className="bg-gray-900 py-1">
                        {item.children.map((child) => {
                          const isActive = location.pathname.startsWith(child.path);
                          return (
                            <li key={child.path}>
                              <Link
                                to={child.path}
                                className={`block pl-8 pr-3 py-2 text-sm transition-colors duration-200
                                  ${isActive ? 'text-ps-primary font-medium bg-gray-800 border-r-4 border-ps-primary' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                              >
                                {child.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                   <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded transition-colors duration-200 mb-1
                      ${location.pathname.startsWith(item.path)
                        ? 'bg-ps-primary text-white shadow-md'
                        : 'hover:bg-gray-800 hover:text-gray-200'}`}
                  >
                     <span className={`w-1.5 h-1.5 rounded-full ${location.pathname.startsWith(item.path) ? 'bg-white' : 'bg-gray-500'}`}></span>
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <button
              onClick={togglePin}
              className="text-gray-500 hover:text-ps-primary focus:outline-none p-1 rounded"
              title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
               </svg>
            </button>
             {/* Breadcrumb placeholder or Page Title could go here */}
          </div>

          <div className="flex items-center gap-6">
             <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-ps-primary transition-colors"
             >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                <span className="hidden sm:inline">View my shop</span>
             </a>

             <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                  className="flex items-center gap-3 focus:outline-none"
                >
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-gray-700">{userEmail}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                </button>

                {isUserMenuOpen && (
                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                        <div className="text-sm font-medium text-gray-900 truncate">{userEmail}</div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                      >
                         Sign out
                      </button>
                   </div>
                )}
             </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
