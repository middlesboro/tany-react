import React from 'react';

const EmailCampaignForm = ({ emailCampaign, handleChange, handleSubmit, handleSaveAndStay }) => {
  const handleTagsChange = (e) => {
    const value = e.target.value;
    handleChange({
      target: {
        name: 'tags',
        value: value ? value.split(',').map(tag => tag.trim()).filter(Boolean) : []
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={emailCampaign.name || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Template ID</label>
        <input
          type="text"
          name="templateId"
          value={emailCampaign.templateId || ''}
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
            checked={emailCampaign.active || false}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-gray-700 font-bold">Active</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Batch Size</label>
        <input
          type="number"
          name="batchSize"
          value={emailCampaign.batchSize || 100}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          min="1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Tags (comma separated)</label>
        <input
          type="text"
          name="tags"
          value={emailCampaign.tags ? emailCampaign.tags.join(', ') : ''}
          onChange={handleTagsChange}
          className="w-full px-3 py-2 border rounded"
          placeholder="e.g. newsletter, promotion"
        />
        <p className="text-sm text-gray-500 mt-1">Customers with any of these tags will receive the campaign. Leave blank to target all subscribed customers.</p>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Save
        </button>
        <button
          type="button"
          onClick={handleSaveAndStay}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save and stay
        </button>
      </div>
    </form>
  );
};

export default EmailCampaignForm;
