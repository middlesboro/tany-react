import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerEmail, createCustomerEmail, updateCustomerEmail } from '../services/customerEmailAdminService';
import CustomerEmailForm from '../components/CustomerEmailForm';
import ErrorAlert from '../components/ErrorAlert';

const CustomerEmailEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [customerEmail, setCustomerEmail] = useState({
    email: '',
    subscribed: true,
    subscribedDate: new Date().toISOString().split('T')[0],
    sentMails: 0,
    tags: []
  });

  useEffect(() => {
    if (id) {
      const fetchCustomerEmailData = async () => {
        try {
          const data = await getCustomerEmail(id);
          setCustomerEmail(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchCustomerEmailData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    if (name === 'sentMails') {
      val = parseInt(val, 10) || 0;
    }

    setCustomerEmail((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    try {
      if (id) {
        await updateCustomerEmail(id, customerEmail);
      } else {
        await createCustomerEmail(customerEmail);
      }
      navigate('/customer-emails');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveAndStay = async () => {
    setError(null);
    try {
      if (id) {
        await updateCustomerEmail(id, customerEmail);
      } else {
        const newCustomerEmail = await createCustomerEmail(customerEmail);
        navigate(`/customer-emails/${newCustomerEmail.id}`, { replace: true });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Customer Email' : 'Add Customer Email'}</h1>
      <ErrorAlert message={error} />
      <CustomerEmailForm
        customerEmail={customerEmail}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSaveAndStay={handleSaveAndStay}
      />
    </div>
  );
};

export default CustomerEmailEdit;
