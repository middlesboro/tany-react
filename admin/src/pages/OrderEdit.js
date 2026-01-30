import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getOrder, createOrder, updateOrder, patchOrder, downloadInvoice } from '../services/orderAdminService';
import { getCarriers } from '../services/carrierAdminService';
import { getPayments } from '../services/paymentAdminService';
import { getCartDiscounts } from '../services/cartDiscountAdminService';
import OrderForm from '../components/OrderForm';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [carriers, setCarriers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [cartDiscounts, setCartDiscounts] = useState([]);
  const [initialOrder, setInitialOrder] = useState(null);
  const [order, setOrder] = useState({
    cartId: '',
    customerId: '',
    customerName: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    finalPrice: '',
    items: [],
    cartDiscountIds: [],
    carrierId: '',
    paymentId: '',
    selectedPickupPointId: '',
    deliveryAddress: { street: '', city: '', zip: '' },
    invoiceAddress: { street: '', city: '', zip: '' },
    deliveryAddressSameAsInvoiceAddress: false,
    note: '',
    priceBreakDown: null,
    status: 'CREATED',
    statusHistory: [],
    createDate: null,
    carrierOrderStateLink: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carriersData, paymentsData, discountsData] = await Promise.all([
          getCarriers(0, 'name,asc', 100),
          getPayments(0, 'name,asc', 100),
          getCartDiscounts(0, 'title,asc', 100)
        ]);
        setCarriers(carriersData.content || []);
        setPayments(paymentsData.content || []);
        setCartDiscounts(discountsData.content || []);
      } catch (error) {
        console.error("Failed to fetch carriers, payments or discounts", error);
      }
    };
    fetchData();

    if (id) {
      const fetchOrder = async () => {
        const data = await getOrder(id);
        setOrder(data);
        setInitialOrder(data);
      };
      fetchOrder();
    } else if (location.state?.duplicatedOrder) {
      setOrder(location.state.duplicatedOrder);
    }
  }, [id, location.state]);

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

  const handleAddItem = (item) => {
    setOrder(prev => ({ ...prev, items: [...prev.items, item] }));
  };

  const handleRemoveItem = (index) => {
    setOrder(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const handleUpdateItem = (index, updatedItem) => {
    setOrder(prev => {
      const newItems = [...prev.items];
      newItems[index] = updatedItem;
      return { ...prev, items: newItems };
    });
  };

  const getDiff = (initial, current) => {
    if (!initial) return current;
    const diff = {};
    Object.keys(current).forEach(key => {
      if (current[key] !== initial[key]) {
        diff[key] = current[key];
      }
    });
    return diff;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      const changedFields = getDiff(initialOrder, order);
      if (Object.keys(changedFields).length > 0) {
        await patchOrder(id, changedFields);
      }
    } else {
      const createPayload = {
        ...order,
        items: order.items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity
        }))
      };
      await createOrder(createPayload);
    }
    navigate('/orders');
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await downloadInvoice(id);
      if (response.ok) {

        let fileName = `invoice-${id}.pdf`;
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (fileNameMatch != null && fileNameMatch[1]) {
            fileName = fileNameMatch[1].replace(/['"]/g, '');
          }
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
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
        cartDiscounts={cartDiscounts}
        isCreateMode={!id}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onUpdateItem={handleUpdateItem}
      />
    </div>
  );
};

export default OrderEdit;
