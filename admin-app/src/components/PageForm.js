import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const PageForm = ({ page, handleChange, handleSubmit, handleSaveAndStay }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

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
          value={page.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Slug</label>
        <input
          type="text"
          name="slug"
          value={page.slug}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <ReactQuill
          theme="snow"
          value={page.description || ''}
          onChange={handleQuillChange('description')}
          modules={modules}
          className="bg-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Meta Title</label>
        <input
          type="text"
          name="metaTitle"
          value={page.metaTitle || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Meta Description</label>
        <textarea
          name="metaDescription"
          value={page.metaDescription || ''}
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
            checked={page.visible}
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

export default PageForm;
