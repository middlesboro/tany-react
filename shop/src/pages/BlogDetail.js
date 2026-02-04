import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlog } from '../services/blogService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import SeoHead from '../components/SeoHead';

const BlogDetail = () => {
  const { id } = useParams();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlog(id);
        if (data) {
          setBlog(data);
          setBreadcrumbs([
            { label: 'Domov', path: '/' },
            { label: data.title, path: null } // Or { label: 'Blog', path: '/blog' }, { label: data.title, path: null } if a blog index exists
          ]);
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        setError('Failed to load blog');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tany-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('sk-SK');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SeoHead
        title={blog.title}
        description={blog.shortDescription || blog.description}
        type="article"
        image={blog.image}
      />
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>

        <div className="flex items-center text-gray-500 text-sm mb-6">
          {blog.author && <span className="mr-4 font-medium">Autor: {blog.author}</span>}
          <span>{formatDate(blog.createdDate)}</span>
        </div>

        {blog.image && (
          <div className="w-full h-64 md:h-96 relative overflow-hidden rounded-lg mb-8 shadow-sm">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-700">
           {/* If there is a short description, we can show it as an intro */}
           {blog.shortDescription && (
             <div className="font-bold mb-6 text-xl text-gray-600 leading-relaxed">
               {blog.shortDescription}
             </div>
           )}

           <div dangerouslySetInnerHTML={{ __html: blog.description ? blog.description.replace(/&nbsp;|\u00A0/g, ' ') : '' }} />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
