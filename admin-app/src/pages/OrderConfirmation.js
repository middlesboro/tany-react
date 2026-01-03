import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/orderService';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading order details...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  if (!order) return <div className="container mx-auto px-4 py-8">Order not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
        <p className="font-bold">Thank you!</p>
        <p>Your order has been placed successfully.</p>
      </div>

      <h1 className="text-3xl font-bold mb-6">Order #{order.id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
          {order.deliveryAddress ? (
            <div>
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.zip}</p>
            </div>
          ) : <p>N/A</p>}
        </div>
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-bold mb-4">Invoice Address</h2>
          {order.invoiceAddress ? (
            <div>
              <p>{order.invoiceAddress.street}</p>
              <p>{order.invoiceAddress.city}, {order.invoiceAddress.zip}</p>
            </div>
          ) : <p>N/A</p>}
        </div>
      </div>

      <div className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {order.items && order.items.map((item) => (
                    <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                {item.image && (
                                    <div className="flex-shrink-0 h-10 w-10 mr-4">
                                        <img className="h-10 w-10 rounded-full object-cover" src={item.image} alt={item.name} />
                                    </div>
                                )}
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.price ? `${item.price.toFixed(2)} €` : '-'}
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(item.price && item.quantity) ? `${(item.price * item.quantity).toFixed(2)} €` : '-'}
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className="mt-4 flex justify-end">
            <div className="text-xl font-bold">
                Total Price: {order.finalPrice ? `${order.finalPrice.toFixed(2)} €` : '-'}
            </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded hover:bg-blue-700">
            Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
