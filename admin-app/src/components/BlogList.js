import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, deleteBlog } from '../services/blogAdminService';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('title,asc');

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getBlogs(page, sort, size);
      setBlogs(data.content);
      setTotalPages(data.totalPages);
    };
    fetchBlogs();
  }, [page, sort, size]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await deleteBlog(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    }
  };

  const handleSort = (field) => {
    const [currentField, currentDirection] = sort.split(',');
    if (currentField === field) {
      setSort(`${field},${currentDirection === 'asc' ? 'desc' : 'asc'}`);
    } else {
      setSort(`${field},asc`);
    }
  };

  return (
    <div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('title')}>
              Title
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('author')}>
              Author
            </th>
            <th className="py-2 px-4 border-b">
              Image
            </th>
            <th className="py-2 px-4 border-b">
              Visible
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td className="py-2 px-4 border-b">{blog.title}</td>
              <td className="py-2 px-4 border-b">{blog.author}</td>
              <td className="py-2 px-4 border-b">
                {blog.image && (
                  <img src={blog.image} alt={blog.title} className="h-10 w-10 object-cover rounded" />
                )}
              </td>
              <td className="py-2 px-4 border-b">
                 {blog.visible ? (
                   <span className="text-green-500">Yes</span>
                 ) : (
                   <span className="text-red-500">No</span>
                 )}
              </td>
              <td className="py-2 px-4 border-b">
                <Link to={`/admin/blogs/${blog.id}`} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <span className="mr-2">Items per page:</span>
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="border rounded p-1"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          >
            Previous
          </button>
          <span className="mr-2">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page + 1 >= totalPages}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
