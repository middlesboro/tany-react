import React from 'react';
import PriceBreakdown from './PriceBreakdown';

const OrderForm = ({ order, handleChange, handleSubmit, carriers = [], payments = [] }) => {
  const selectedCarrier = carriers.find(c => c.id === Number(order.carrierId));
  const isPacketa = selectedCarrier && selectedCarrier.name.toLowerCase().includes('packeta');

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
