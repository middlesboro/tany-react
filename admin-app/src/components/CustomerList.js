import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers, deleteCustomer } from '../services/customerService';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('lastname,asc');

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await getCustomers(page, sort);
      setCustomers(data.content);
      setTotalPages(data.totalPages);
    };
    fetchCustomers();
  }, [page, sort]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
      setCustomers(customers.filter((customer) => customer.id !== id));
    }
  };

  const handleSort = (field) => {
    const [currentField, currentDirection] = sort.split(',');
    if (currentField === field) {
      setSort(`${field},${currentDirection === 'asc' ? 'desc' : 'asc'}`);
    } else {
      setSort(`${field},asc`);
    }
  };

  return (
    <div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('lastname')}>
              Name
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort('email')}>
              Email
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="py-2 px-4 border-b">{customer.firstname} {customer.lastname}</td>
              <td className="py-2 px-4 border-b">{customer.email}</td>
              <td className="py-2 px-4 border-b">
                <Link to={`/admin/customers/${customer.id}`} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          Previous
        </button>
        <span>
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
  );
};

export default CustomerList;
