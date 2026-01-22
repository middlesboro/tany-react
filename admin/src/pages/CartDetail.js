import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCartById } from '../services/cartAdminService';

const CartDetail = () => {
  const { id } = useParams();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartById(id);
        setCart(data);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!cart) {
    return <div className="p-4">Cart not found</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <Link to="/carts" className="text-blue-500 hover:underline">
          &larr; Back to Carts
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Cart Detail</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Cart ID:</p>
            <p className="font-semibold">{cart.cartId}</p>
          </div>
          <div>
            <p className="text-gray-600">Customer Name:</p>
            <p className="font-semibold">{cart.customerName}</p>
          </div>
          <div>
            <p className="text-gray-600">Created Date:</p>
            <p className="font-semibold">{cart.createDate ? new Date(cart.createDate).toLocaleString() : '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Updated Date:</p>
            <p className="font-semibold">{cart.updateDate ? new Date(cart.updateDate).toLocaleString() : '-'}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Items</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cart.items && cart.items.map((item, index) => (
              <tr key={item.productId || index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="h-12 w-12 object-cover rounded" />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">No Img</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price} €</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
              </tr>
            ))}
            {(!cart.items || cart.items.length === 0) && (
               <tr>
                 <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No items in this cart.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CartDetail;
