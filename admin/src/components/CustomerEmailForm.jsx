import React from 'react';

const CustomerEmailForm = ({ customerEmail, handleChange, handleSubmit, handleSaveAndStay }) => {
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
        <label className="block text-gray-700 font-bold mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={customerEmail.email || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="subscribed"
            checked={customerEmail.subscribed || false}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-gray-700 font-bold">Subscribed</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Subscribed Date</label>
        <input
          type="date"
          name="subscribedDate"
          value={customerEmail.subscribedDate || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Sent Mails</label>
        <input
          type="number"
          name="sentMails"
          value={customerEmail.sentMails || 0}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          min="0"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Tags (comma separated)</label>
        <input
          type="text"
          name="tags"
          value={customerEmail.tags ? customerEmail.tags.join(', ') : ''}
          onChange={handleTagsChange}
          className="w-full px-3 py-2 border rounded"
          placeholder="e.g. newsletter, vip, leads"
        />
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

export default CustomerEmailForm;
