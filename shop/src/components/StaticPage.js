import React, { useEffect } from 'react';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import usePageMeta from '../hooks/usePageMeta';

const StaticPage = ({ title, description, children }) => {
  const { setBreadcrumbs } = useBreadcrumbs();

  usePageMeta(title, description);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Domov', path: '/' },
      { label: title, path: null }
    ]);
  }, [title, setBreadcrumbs]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{title}</h1>
      <div className="text-gray-700 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default StaticPage;
