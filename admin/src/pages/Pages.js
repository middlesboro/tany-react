import React from 'react';
import { Link } from 'react-router-dom';
import PageList from '../components/PageList';

const Pages = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Page Management</h1>
        <Link to="/admin/pages/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Page
        </Link>
      </div>
      <PageList />
    </div>
  );
};

export default Pages;
