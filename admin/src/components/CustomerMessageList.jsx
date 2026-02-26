import React, { useEffect, useState } from 'react';
import { getCustomerMessages } from '../services/customerMessageService';
import usePersistentTableState from '../hooks/usePersistentTableState';

const CustomerMessageList = () => {
  const {
    page, setPage,
    size, setSize,
    sort, handleSort
  } = usePersistentTableState('admin_customer_messages_list_state', {}, 'createDate,desc');

  const [messages, setMessages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getCustomerMessages(page, sort, size);
      setMessages(data.content);
      setTotalPages(data.totalPages);
    };
    fetchMessages();
  }, [page, sort, size]);

  return (
    <div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('createDate')}>
              Create Date
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('email')}>
              Email
            </th>
             <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('message')}>
              Message
            </th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id}>
              <td className="py-2 px-4 border-b whitespace-nowrap">
                {msg.createDate ? new Date(msg.createDate).toLocaleString() : ''}
              </td>
              <td className="py-2 px-4 border-b">{msg.email}</td>
              <td className="py-2 px-4 border-b">{msg.message}</td>
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
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          >
            Previous
          </button>
          <span className="mr-2">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page + 1 >= totalPages}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerMessageList;
