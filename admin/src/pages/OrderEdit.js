import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, createOrder, updateOrder, downloadInvoice } from '../services/orderAdminService';
import { getCarriers } from '../services/carrierAdminService';
import { getPayments } from '../services/paymentAdminService';
import OrderForm from '../components/OrderForm';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [carriers, setCarriers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [order, setOrder] = useState({
    cartId: '',
    customerId: '',
    finalPrice: '',
    items: [],
    carrierId: '',
    paymentId: '',
    deliveryAddress: { street: '', city: '', zip: '' },
    invoiceAddress: { street: '', city: '', zip: '' },
    deliveryAddressSameAsInvoiceAddress: false,
    note: '',
    priceBreakDown: null,
    status: 'CREATED',
    statusHistory: [],
    createDate: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carriersData, paymentsData] = await Promise.all([
          getCarriers(0, 'name,asc', 100),
          getPayments(0, 'name,asc', 100)
        ]);
        setCarriers(carriersData.content || []);
        setPayments(paymentsData.content || []);
      } catch (error) {
        console.error("Failed to fetch carriers or payments", error);
      }
    };
    fetchData();

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
    navigate('/orders');
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await downloadInvoice(id);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{id ? 'Edit Order' : 'Create Order'}</h1>
        {id && (
          <button
            onClick={handleDownloadInvoice}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition duration-150 ease-in-out"
          >
            Download Invoice
          </button>
        )}
      </div>
      <OrderForm
        order={order}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        carriers={carriers}
        payments={payments}
      />
    </div>
  );
};

export default OrderEdit;
