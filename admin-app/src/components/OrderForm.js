import React from 'react';
import PriceBreakdown from './PriceBreakdown';

const OrderForm = ({ order, handleChange, handleSubmit, carriers = [], payments = [] }) => {
  const getCarrierDisplay = () => {
    if (!order.carrierId) return '';
    const carrier = carriers.find(c => c.id === Number(order.carrierId));
    if (!carrier) return order.carrierId;

    let display = carrier.name;
    if (carrier.name.toLowerCase().includes('packeta') && order.selectedPickupPointName) {
      display += ` (${order.selectedPickupPointName})`;
    }
    return display;
  };

  const getPaymentDisplay = () => {
    if (!order.paymentId) return '';
    const payment = payments.find(p => p.id === Number(order.paymentId));
    return payment ? payment.name : order.paymentId;
  };

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
            <div className="w-full px-3 py-2 border rounded bg-gray-50">
              {getCarrierDisplay() || '-'}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Payment</label>
            <div className="w-full px-3 py-2 border rounded bg-gray-50">
              {getPaymentDisplay() || '-'}
            </div>
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
        <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Street</label>
            <input
              type="text"
              name="deliveryAddress.street"
              value={order.deliveryAddress?.street || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              name="deliveryAddress.city"
              value={order.deliveryAddress?.city || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Zip</label>
            <input
              type="text"
              name="deliveryAddress.zip"
              value={order.deliveryAddress?.zip || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div className="mb-4">
           <label className="inline-flex items-center">
             <input
               type="checkbox"
               name="deliveryAddressSameAsInvoiceAddress"
               checked={order.deliveryAddressSameAsInvoiceAddress || false}
               onChange={handleChange}
               className="form-checkbox"
             />
             <span className="ml-2">Same as Invoice Address</span>
           </label>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Invoice Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Street</label>
            <input
              type="text"
              name="invoiceAddress.street"
              value={order.invoiceAddress?.street || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              name="invoiceAddress.city"
              value={order.invoiceAddress?.city || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Zip</label>
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
