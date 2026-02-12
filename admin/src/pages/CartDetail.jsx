import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCartById } from '../services/cartAdminService';
import PriceBreakdown from '../components/PriceBreakdown';

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
            <p className="text-gray-600">Order ID:</p>
            <p className="font-semibold">{cart.orderIdentifier || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Customer Name:</p>
            <p className="font-semibold">{cart.customerName || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Carrier:</p>
            <p className="font-semibold">{cart.carrierName || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Payment:</p>
            <p className="font-semibold">{cart.paymentName || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Created Date:</p>
            <p className="font-semibold">{cart.createDate ? new Date(cart.createDate).toLocaleString('sk-SK') : '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Updated Date:</p>
            <p className="font-semibold">{cart.updateDate ? new Date(cart.updateDate).toLocaleString('sk-SK') : '-'}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Price Breakdown</h2>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        {cart.priceBreakDown ? (
            <PriceBreakdown priceBreakDown={cart.priceBreakDown} showItems={true} />
        ) : (
            <div className="text-gray-500">No price breakdown available.</div>
        )}
      </div>
    </div>
  );
};

export default CartDetail;
