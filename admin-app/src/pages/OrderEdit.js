import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, createOrder, updateOrder } from '../services/orderAdminService';
import OrderForm from '../components/OrderForm';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    cartId: '',
    customerId: '',
    finalPrice: '',
    items: [],
    carrierId: '',
    paymentId: '',
    deliveryAddress: { street: '', city: '', zip: '' },
    invoiceAddress: { street: '', city: '', zip: '' },
    deliveryAddressSameAsInvoiceAddress: false
  });

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        const data = await getOrder(id);
        setOrder(data);
      };
      fetchOrder();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setOrder(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: val
        }
      }));
    } else {
      setOrder(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateOrder(id, order);
    } else {
      await createOrder(order);
    }
    navigate('/admin/orders');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Order' : 'Create Order'}</h1>
      <OrderForm order={order} handleChange={handleChange} handleSubmit={handleSubmit} />
    </div>
  );
};

export default OrderEdit;
