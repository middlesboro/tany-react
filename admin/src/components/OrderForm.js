import React from 'react';
import PriceBreakdown from './PriceBreakdown';

const OrderStatus = [
  'CREATED',
  'PAID',
  'COD',
  'SENT',
  'PACKING',
  'DELIVERED',
  'CANCELED'
];

const OrderForm = ({ order, handleChange, handleSubmit, carriers = [], payments = [] }) => {
  const selectedCarrier = carriers.find(c => c.id === order.carrierId);
  const isPacketa = selectedCarrier && selectedCarrier.type === 'PACKETA';

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">General Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Cart ID</label>
            <input
              type="text"
              name="cartId"
              value={order.cartId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Customer ID</label>
            <input
              type="text"
              name="customerId"
              value={order.customerId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Carrier</label>
            <select
              name="carrierId"
              value={order.carrierId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Carrier</option>
              {carriers.map(carrier => (
                <option key={carrier.id} value={carrier.id}>
                  {carrier.name}
                </option>
              ))}
            </select>
            {isPacketa && order.selectedPickupPointName && (
              <div className="mt-1 text-sm text-gray-600">
                Pickup Point: <strong>{order.selectedPickupPointName}</strong>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Payment</label>
            <select
              name="paymentId"
              value={order.paymentId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Payment</option>
              {payments.map(payment => (
                <option key={payment.id} value={payment.id}>
                  {payment.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 mb-4">
            <label className="block text-gray-700">Note</label>
            <textarea
              name="note"
              value={order.note || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Status & Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <select
              name="status"
              value={order.status || 'CREATED'}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              {OrderStatus.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Create Date</label>
            <input
              type="text"
              value={order.createDate ? new Date(order.createDate).toLocaleString('sk-SK') : ''}
              disabled
              className="w-full px-3 py-2 border rounded bg-gray-100"
            />
          </div>
        </div>
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Status History</h3>
            <ul className="list-disc pl-5">
              {order.statusHistory.map((history, index) => (
                <li key={index} className="mb-1">
                  <span className="font-medium">{history.status}</span> - {new Date(history.changeDate || history.date || history.createdAt).toLocaleString('sk-SK')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Addresses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Invoice Address</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 text-sm">Street</label>
                <input
                  type="text"
                  name="invoiceAddress.street"
                  value={order.invoiceAddress?.street || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm">City</label>
                <input
                  type="text"
                  name="invoiceAddress.city"
                  value={order.invoiceAddress?.city || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm">ZIP</label>
                <input
                  type="text"
                  name="invoiceAddress.zip"
                  value={order.invoiceAddress?.zip || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Delivery Address</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 text-sm">Street</label>
                <input
                  type="text"
                  name="deliveryAddress.street"
                  value={order.deliveryAddress?.street || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm">City</label>
                <input
                  type="text"
                  name="deliveryAddress.city"
                  value={order.deliveryAddress?.city || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm">ZIP</label>
                <input
                  type="text"
                  name="deliveryAddress.zip"
                  value={order.deliveryAddress?.zip || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Price Breakdown</h2>
        {order.priceBreakDown ? (
            <PriceBreakdown priceBreakDown={order.priceBreakDown} showItems={true} />
        ) : (
            <div className="text-gray-500">No price breakdown available.</div>
        )}
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
};

export default OrderForm;
