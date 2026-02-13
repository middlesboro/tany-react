import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

const Breadcrumbs = () => {
  const { breadcrumbs } = useBreadcrumbs();
  const location = useLocation();

  // Don't show breadcrumbs on the home page
  if (location.pathname === '/') {
    return null;
  }

  // Don't show if no breadcrumbs set (or just one which is usually Home, but we want to show path)
  if (!breadcrumbs || breadcrumbs.length === 0) {
      return null;
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 py-3 text-sm text-gray-500 mb-6">
      <div className="container mx-auto px-4">
        <nav aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex flex-wrap">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li key={index} className="flex items-center">
                   {index > 0 && (
                     <svg className="w-3 h-3 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                     </svg>
                   )}

                   {isLast || !crumb.path ? (
                     <span className={`font-medium ${isLast ? 'text-gray-800' : 'text-gray-500'}`}>
                       {crumb.label}
                     </span>
                   ) : (
                     <Link
                       to={crumb.path}
                       className="hover:text-tany-green transition-colors duration-200"
                     >
                       {crumb.label}
                     </Link>
                   )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
