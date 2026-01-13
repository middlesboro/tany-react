import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { addToCart } = useCart();
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
      await addToCart(item.id, newQuantity);
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
      await addToCart(item.id, 0);
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

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
             {item.images ? (
                <img className="h-10 w-10 rounded-full object-cover" src={item.images[0]} alt={item.productName} />
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
          {(item.price * item.quantity).toFixed(2)} €
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={handleRemove}
          disabled={updating}
          className="text-red-600 hover:text-red-900"
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
