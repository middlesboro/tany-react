import React from 'react';
import ReactQuill from 'react-quill-new';
import { quillModulesTable } from '../utils/quillConfig';
import 'react-quill-new/dist/quill.snow.css';

const BlogForm = ({ blog, handleChange, handleSubmit, handleSaveAndStay }) => {
  const handleQuillChange = (name) => (value) => {
    // ReactQuill returns the HTML value directly
    handleChange({
      target: {
        name,
        value
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={blog.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Order</label>
        <input
          type="number"
          name="order"
          value={blog.order || 0}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Slug</label>
        <input
          type="text"
          name="slug"
          value={blog.slug}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Author</label>
        <input
          type="text"
          name="author"
          value={blog.author}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Short Description</label>
        <textarea
          name="shortDescription"
          value={blog.shortDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded bg-white"
          rows="5"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <ReactQuill
          theme="snow"
          value={blog.description}
          onChange={handleQuillChange('description')}
          modules={quillModulesTable}
          className="bg-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Meta Title</label>
        <input
          type="text"
          name="metaTitle"
          value={blog.metaTitle || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Meta Description</label>
        <textarea
          name="metaDescription"
          value={blog.metaDescription || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          rows="3"
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="visible"
            checked={blog.visible}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-gray-700">Visible</span>
        </label>
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save
      </button>
      <button
        type="button"
        onClick={handleSaveAndStay}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
      >
        Save and stay
      </button>
    </form>
  );
};

export default BlogForm;
