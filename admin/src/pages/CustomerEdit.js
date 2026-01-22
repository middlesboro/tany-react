import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomer, createCustomer, updateCustomer } from '../services/customerAdminService';
import CustomerForm from '../components/CustomerForm';

const CustomerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        const data = await getCustomer(id);
        setCustomer(data);
      };
      fetchCustomer();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateCustomer(id, customer);
    } else {
      await createCustomer(customer);
    }
    navigate('/customers');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Customer' : 'Create Customer'}</h1>
      <CustomerForm customer={customer} handleChange={handleChange} handleSubmit={handleSubmit} />
    </div>
  );
};

export default CustomerEdit;
