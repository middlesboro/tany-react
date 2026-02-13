import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlog, createBlog, updateBlog } from '../services/blogAdminService';
import BlogForm from '../components/BlogForm';
import BlogImageManager from '../components/BlogImageManager';
import { restoreIframes } from '../utils/videoUtils';

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({
    title: '',
    shortDescription: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    author: '',
    visible: true,
    image: '',
    order: 0,
  });

  useEffect(() => {
    if (id) {
      const fetchBlogData = async () => {
        const data = await getBlog(id);
        if (data && data.description) {
          data.description = restoreIframes(data.description);
        }
        setBlog(data);
      };
      fetchBlogData();
    }
  }, [id]);

  const refreshImage = async () => {
    if (id) {
      const data = await getBlog(id);
      setBlog(prevBlog => ({ ...prevBlog, image: data.image }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setBlog(prevBlog => ({ ...prevBlog, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateBlog(id, blog);
    } else {
      await createBlog(blog);
    }
    navigate('/blogs');
  };

  const handleSaveAndStay = async () => {
    if (id) {
      await updateBlog(id, blog);
    } else {
      const newBlog = await createBlog(blog);
      navigate(`/blogs/${newBlog.id}`, { replace: true });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Blog' : 'Create Blog'}</h1>
      <BlogForm
        blog={blog}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSaveAndStay={handleSaveAndStay}
      />
      {id && (
        <BlogImageManager
          blogId={id}
          image={blog.image}
          onUploadSuccess={refreshImage}
        />
      )}
    </div>
  );
};

export default BlogEdit;
