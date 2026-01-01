import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, loading } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cart.items.map((item) => (
              <tr key={item.id || item.productId}> {/* Fallback to productId if item.id missing */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {item.productImage ? (
                         <img className="h-10 w-10 rounded-full object-cover" src={item.productImage} alt={item.productName} />
                      ) : (
                         <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No Img</div>
                      )}
                    </div>
                    <div className="ml-4">
                      <Link to={`/products/${item.productId}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                        {item.productName}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.price ? item.price.toFixed(2) : '0.00'} €</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} €
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center">
           <span className="text-lg font-bold mr-4">Total:</span>
           <span className="text-xl font-bold text-blue-600">{cart.totalPrice ? cart.totalPrice.toFixed(2) : '0.00'} €</span>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
         <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium mr-4">
            Continue Shopping
          </Link>
          {/* Checkout button could go here */}
      </div>
    </div>
  );
};

export default Cart;
