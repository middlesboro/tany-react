import React from 'react';

const OrderForm = ({ order, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">Cart ID</label>
        <input
          type="text"
          name="cartId"
          value={order.cartId}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Customer ID</label>
        <input
          type="text"
          name="customerId"
          value={order.customerId}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Product IDs</label>
        <input
          type="text"
          name="productIds"
          value={order.productIds ? order.productIds.join(', ') : ''}
          onChange={(e) => handleChange({ target: { name: 'productIds', value: e.target.value.split(',').map(s => s.trim()) } })}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Final Price</label>
        <input
          type="number"
          name="finalPrice"
          value={order.finalPrice}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
};

export default OrderForm;
