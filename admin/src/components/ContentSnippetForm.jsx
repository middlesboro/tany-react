import React from 'react';
import ReactQuill from 'react-quill-new';
import { quillModules } from '../utils/quillConfig';
import 'react-quill-new/dist/quill.snow.css';

const ContentSnippetForm = ({ contentSnippet, handleChange, handleSubmit, handleSaveAndStay }) => {
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
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={contentSnippet.name || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Placeholder</label>
        <input
          type="text"
          name="placeholder"
          value={contentSnippet.placeholder || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Content</label>
        <ReactQuill
          theme="snow"
          value={contentSnippet.content || ''}
          onChange={handleQuillChange('content')}
          modules={quillModules}
          className="bg-white"
        />
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

export default ContentSnippetForm;
