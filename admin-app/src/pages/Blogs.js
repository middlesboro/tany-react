import React from 'react';
import { Link } from 'react-router-dom';
import BlogList from '../components/BlogList';

const Blogs = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Link to="/admin/blogs/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Blog
        </Link>
      </div>
      <BlogList />
    </div>
  );
};

export default Blogs;
