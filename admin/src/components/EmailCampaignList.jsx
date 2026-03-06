import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEmailCampaigns, deleteEmailCampaign } from '../services/emailCampaignAdminService';
import usePersistentTableState from '../hooks/usePersistentTableState';

const EmailCampaignList = () => {
  const {
    page, setPage,
    size, setSize,
    sort, handleSort
  } = usePersistentTableState('admin_email_campaigns_list_state', {}, 'name,asc');

  const [emailCampaigns, setEmailCampaigns] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchEmailCampaigns = async () => {
      const data = await getEmailCampaigns(page, sort, size);
      setEmailCampaigns(data.content);
      setTotalPages(data.totalPages);
    };
    fetchEmailCampaigns();
  }, [page, sort, size]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this email campaign?')) {
      await deleteEmailCampaign(id);
      setEmailCampaigns(emailCampaigns.filter((ec) => ec.id !== id));
    }
  };

  return (
    <div>
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer text-left" onClick={() => handleSort('name')}>
              Name
            </th>
            <th className="py-2 px-4 border-b cursor-pointer text-left" onClick={() => handleSort('templateId')}>
              Template ID
            </th>
            <th className="py-2 px-4 border-b cursor-pointer text-left" onClick={() => handleSort('active')}>
              Active
            </th>
            <th className="py-2 px-4 border-b cursor-pointer text-left" onClick={() => handleSort('batchSize')}>
              Batch Size
            </th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {emailCampaigns.map((ec) => (
            <tr key={ec.id} className="hover:bg-gray-50 border-b last:border-0">
              <td className="py-2 px-4">{ec.name}</td>
              <td className="py-2 px-4">{ec.templateId}</td>
              <td className="py-2 px-4">
                {ec.active ? (
                  <span className="text-green-500 font-bold">Yes</span>
                ) : (
                  <span className="text-red-500 font-bold">No</span>
                )}
              </td>
              <td className="py-2 px-4">{ec.batchSize}</td>
              <td className="py-2 px-4">
                <Link
                  to={`/email-campaigns/${ec.id}`}
                  className="text-blue-500 hover:text-blue-700 mr-2 inline-block"
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDelete(ec.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
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
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mr-2">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page + 1 >= totalPages}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailCampaignList;
