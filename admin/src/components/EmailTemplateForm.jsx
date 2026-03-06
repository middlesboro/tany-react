import React, { useRef, useEffect } from 'react';
import EmailEditor from 'react-email-editor';

const EmailTemplateForm = ({ emailTemplate, handleChange, handleSubmit, handleSaveAndStay }) => {
  const emailEditorRef = useRef(null);

  const onReady = () => {
    if (emailTemplate.content) {
      try {
        const design = JSON.parse(emailTemplate.content);
        if (emailEditorRef.current?.editor) {
          emailEditorRef.current.editor.loadDesign(design);
        }
      } catch (e) {
        console.error("Failed to load design:", e);
      }
    }
  };

  const handleFormSubmit = (e, submitCallback) => {
    e.preventDefault();
    if (emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.saveDesign((design) => {
        const content = JSON.stringify(design);
        const fakeEvent = {
          target: {
            name: 'content',
            value: content
          }
        };
        handleChange(fakeEvent);

        // Pass the explicitly updated template directly to the submit callback
        submitCallback(e, { ...emailTemplate, content });
      });
    } else {
      submitCallback(e);
    }
  };

  const onSave = (e) => {
    handleFormSubmit(e, handleSubmit);
  };

  const onSaveAndStay = (e) => {
    handleFormSubmit(e, handleSaveAndStay);
  };

  return (
    <form onSubmit={onSave} className="bg-white p-6 rounded shadow-md flex flex-col h-[80vh]">
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={emailTemplate.name || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="active"
            checked={emailTemplate.active || false}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-gray-700 font-bold">Active</span>
        </label>
      </div>

      <div className="mb-4 flex-1">
        <label className="block text-gray-700 font-bold mb-2">Content</label>
        <div className="border rounded h-full min-h-[500px]">
          <EmailEditor
            ref={emailEditorRef}
            onReady={onReady}
            options={{
              projectId: import.meta.env.VITE_UNLAYER_PROJECT_ID || undefined,
              displayMode: "email",
              version: "latest",
            }}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Save
        </button>
        <button
          type="button"
          onClick={onSaveAndStay}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save and stay
        </button>
      </div>
    </form>
  );
};

export default EmailTemplateForm;
