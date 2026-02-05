import React from 'react';
import PriceBreakdown from './PriceBreakdown';
import OrderCreateItems from './OrderCreateItems';

const OrderStatus = [
  'CREATED',
  'PAID',
  'COD',
  'SENT',
  'PACKING',
  'DELIVERED',
  'CANCELED'
];

const OrderForm = ({
  order,
  handleChange,
  handleSubmit,
  carriers = [],
  payments = [],
  cartDiscounts = [],
  isCreateMode = false,
  onAddItem,
  onRemoveItem,
  onUpdateItem
}) => {
  const selectedCarrier = carriers.find(c => c.id === order.carrierId);
  const isPacketa = selectedCarrier && selectedCarrier.type === 'PACKETA';

  const getOutOfStockItems = () => {
    if (isCreateMode) {
      return (order.items || []).filter(item => item.stockQuantity !== undefined && item.stockQuantity <= 0);
    } else {
      if (!order.priceBreakDown || !order.priceBreakDown.items) return [];
      return order.priceBreakDown.items.filter(item => item.type === 'PRODUCT' && item.currentQuantity !== undefined && item.currentQuantity <= 0);
    }
  };

  const outOfStockItems = getOutOfStockItems();

  return (
    <form onSubmit={handleSubmit}>
      {outOfStockItems.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Upozornenie: Niektoré produkty nie sú na sklade
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {outOfStockItems.map((item, index) => (
                    <li key={index}>
                      {item.name} {item.currentQuantity !== undefined ? `(Skladom: ${item.currentQuantity} ks)` : (item.stockQuantity !== undefined ? `(Skladom: ${item.stockQuantity} ks)` : '')}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

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
          {isCreateMode ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={order.firstname || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={order.lastname || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label className="block text-gray-700">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={order.customerName || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="text"
              name="email"
              value={order.email || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={order.phone || ''}
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
            {isCreateMode && (
                <div className="mt-2">
                     <label className="block text-sm text-gray-600">Pickup Point ID</label>
                     <input
                        type="text"
                        name="selectedPickupPointId"
                        value={order.selectedPickupPointId || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded text-sm"
                        placeholder="e.g. 1234"
                     />
                </div>
            )}
            {isPacketa && order.selectedPickupPointName && !isCreateMode && (
              <div className="mt-1 text-sm text-gray-600">
                Pickup Point: <strong>{order.selectedPickupPointName}</strong>
              </div>
            )}
            {order.carrierOrderStateLink && (
              <div className="mt-2">
                <a
                  href={order.carrierOrderStateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline block"
                >
                  Track Package
                </a>
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
          {isCreateMode && (
              <div className="mb-4">
                <label className="block text-gray-700">Discounts</label>
                <select
                  multiple
                  name="cartDiscountIds"
                  value={order.cartDiscountIds || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    handleChange({ target: { name: 'cartDiscountIds', value: values } });
                  }}
                  className="w-full px-3 py-2 border rounded h-24"
                >
                  {cartDiscounts.map(discount => (
                    <option key={discount.id} value={discount.id}>
                      {discount.title}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple options.</p>
              </div>
          )}
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
        <h2 className="text-xl font-bold mb-4">{isCreateMode ? 'Products' : 'Price Breakdown'}</h2>
        {isCreateMode ? (
            <OrderCreateItems
                items={order.items || []}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
                onUpdateItem={onUpdateItem}
            />
        ) : (
            order.priceBreakDown ? (
                <PriceBreakdown priceBreakDown={order.priceBreakDown} showItems={true} />
            ) : (
                <div className="text-gray-500">No price breakdown available.</div>
            )
        )}
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
};

export default OrderForm;
