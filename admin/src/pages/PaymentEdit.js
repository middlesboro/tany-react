import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPayment, createPayment, updatePayment } from '../services/paymentAdminService';
import PaymentImageManager from '../components/PaymentImageManager';

const PaymentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState({
    name: '',
    description: '',
    image: '',
    price: 0,
    type: 'COD',
  });

  useEffect(() => {
    if (id) {
      const fetchPaymentData = async () => {
        const data = await getPayment(id);
        setPayment(data);
      };
      fetchPaymentData();
    }
  }, [id]);

  const refreshImage = async () => {
    if (id) {
      const data = await getPayment(id);
      setPayment(prev => ({ ...prev, image: data.image }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (id) {
            await updatePayment(id, payment);
        } else {
            await createPayment(payment);
        }
        navigate('/payments');
    } catch (error) {
        console.error("Error saving payment:", error);
        alert("Error saving payment");
    }
  };

  const handleSaveAndStay = async () => {
    try {
        if (id) {
            await updatePayment(id, payment);
        } else {
            const newPayment = await createPayment(payment);
            navigate(`/payments/${newPayment.id}`, { replace: true });
        }
    } catch (error) {
        console.error("Error saving payment:", error);
        alert("Error saving payment");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Payment' : 'Create Payment'}</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={payment.name || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={payment.description || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={payment.price || 0}
            onChange={handleChange}
            step="0.01"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={payment.type || 'COD'}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="COD">COD (Cash on Delivery)</option>
            <option value="GLOBAL_PAYMENTS">Global Payments</option>
            <option value="BESTERON">Besteron</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleSaveAndStay}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save and stay
          </button>
          <button
            type="button"
            onClick={() => navigate('/payments')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
      {id && (
        <PaymentImageManager
          paymentId={id}
          image={payment.image}
          onUploadSuccess={refreshImage}
        />
      )}
    </div>
  );
};

export default PaymentEdit;
