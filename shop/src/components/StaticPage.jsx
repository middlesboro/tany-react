import React, { useEffect } from 'react';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import SeoHead from './SeoHead';

const StaticPage = ({ title, description, children }) => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Domov', path: '/' },
      { label: title, path: null }
    ]);
  }, [title, setBreadcrumbs]);

  return (
    <div className="container mx-auto px-4 py-8">
      <SeoHead title={title} description={description} />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{title}</h1>
      <div className="text-gray-700 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default StaticPage;
