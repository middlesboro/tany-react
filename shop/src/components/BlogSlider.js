import React from 'react';
import { Link } from 'react-router-dom';

const BlogSlider = ({ blogs }) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  // Format date
  const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('sk-SK');
  };

  return (
    <div className="container mx-auto px-4 mt-12 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase">Naše články</h2>

      <div className="relative group">
        {/* Grid for items - 1 col mobile, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
                <div key={blog.id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 flex flex-col h-full">
                    {/* Image Section */}
                    <div className="h-48 relative overflow-hidden">
                        <Link to={`/blog/${blog.id}`} className="block w-full h-full">
                            {blog.image ? (
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                    Bez obrázku
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-grow">
                        <Link to={`/blog/${blog.id}`} className="text-xl font-bold text-gray-800 hover:text-tany-green transition-colors mb-2 line-clamp-2">
                            {blog.title}
                        </Link>

                        <div className="text-sm text-gray-500 mb-3">
                            {blog.author && <span className="mr-2">Pridala: {blog.author},</span>}
                            <span>{formatDate(blog.createdDate)}</span>
                        </div>

                        <div className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">
                            {blog.shortDescription}
                        </div>

                        <div className="mt-auto">
                             <Link to={`/blog/${blog.id}`} className="inline-block bg-tany-green text-white font-bold py-2 px-6 rounded hover:bg-green-700 transition-colors uppercase text-sm">
                                Prečítať
                             </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSlider;
