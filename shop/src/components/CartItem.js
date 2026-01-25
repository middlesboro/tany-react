import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { addToCart, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleUpdate = async () => {
    const newQuantity = parseInt(quantity, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
       setQuantity(item.quantity);
       return;
    }

    if (newQuantity === item.quantity) return;

    setUpdating(true);
    try {
      await addToCart(item.productId || item.id, newQuantity);
    } catch (error) {
      console.error("Failed to update cart item", error);
      setQuantity(item.quantity);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    setUpdating(true);
    try {
      await removeFromCart(item.productId || item.id);
    } catch (error) {
      console.error("Failed to remove item", error);
      setUpdating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  // Handle both old (images array, productName) and new (image string, title) structures
  const displayImage = item.image || (item.images && item.images[0]);
  const displayName = item.title || item.productName;

  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
             {displayImage ? (
                <img className="h-10 w-10 rounded-full object-cover" src={displayImage} alt={displayName} />
             ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No Img</div>
             )}
          </div>
          <div className="ml-4">
            <Link to={`/products/${item.productId || item.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
              {displayName}
            </Link>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {item.discountPrice ? (
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">{item.price ? item.price.toFixed(2) : '0.00'} €</span>
            <span className="text-sm font-bold text-red-600">{item.discountPrice.toFixed(2)} €</span>
          </div>
        ) : (
          <div className="text-sm text-gray-900">{item.price ? item.price.toFixed(2) : '0.00'} €</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
            <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onBlur={handleUpdate}
                onKeyDown={handleKeyDown}
                disabled={updating}
                className={`w-16 border rounded px-2 py-1 text-center text-sm ${updating ? 'bg-gray-100 text-gray-500' : 'text-gray-900'}`}
            />
            {updating && <span className="ml-2 text-xs text-gray-500">...</span>}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {((item.discountPrice || item.price) * item.quantity).toFixed(2)} €
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={handleRemove}
          disabled={updating}
          className="text-red-600 hover:text-red-900"
          title="Remove item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
