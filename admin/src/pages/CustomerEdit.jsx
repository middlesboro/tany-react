import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomer, createCustomer, updateCustomer } from '../services/customerAdminService';
import CustomerForm from '../components/CustomerForm';
import ErrorAlert from '../components/ErrorAlert';

const CustomerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState({
    firstname: '',
    lastname: '',
    email: '',
    role: 'CUSTOMER',
    invoiceAddress: { street: '', city: '', zip: '', country: '' },
    deliveryAddress: { street: '', city: '', zip: '', country: '' },
  });

  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        const data = await getCustomer(id);
        setCustomer({
          role: 'CUSTOMER',
          ...data,
          invoiceAddress: data.invoiceAddress || { street: '', city: '', zip: '', country: '' },
          deliveryAddress: data.deliveryAddress || { street: '', city: '', zip: '', country: '' },
        });
      };
      fetchCustomer();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCustomer({
        ...customer,
        [parent]: {
          ...customer[parent],
          [child]: value,
        },
      });
    } else {
      setCustomer({ ...customer, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (id) {
        await updateCustomer(id, customer);
      } else {
        await createCustomer(customer);
      }
      navigate('/customers');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Customer' : 'Create Customer'}</h1>
      <ErrorAlert message={error} />
      <CustomerForm customer={customer} handleChange={handleChange} handleSubmit={handleSubmit} />
    </div>
  );
};

export default CustomerEdit;
