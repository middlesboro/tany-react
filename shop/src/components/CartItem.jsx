import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import { logRemoveFromCart } from '../utils/analytics';

const CartItem = ({ item }) => {
  const { addToCart, removeFromCart } = useCart();
  const { openMessageModal } = useModal();
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
      if (error.status === 400) {
        openMessageModal("Upozornenie", "Pre tento produkt nie je na sklade dostatočné množstvo.");
      } else {
        console.error("Failed to update cart item", error);
      }
      setQuantity(item.quantity);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    setUpdating(true);
    logRemoveFromCart(item);
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
    <div className="product">
      {/* Image */}
      <div>
         {displayImage ? (
            <img src={displayImage} alt={displayName} />
         ) : (
            <div className="w-20 h-20 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No Img</div>
         )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <Link to={`/produkt/${item.slug}`} className="block font-bold text-gray-800 hover:text-[#2f6f4f] no-underline mb-1">
          {displayName}
        </Link>
        <div className="muted">
           {item.discountPrice ? (
             <>
               <span className="line-through mr-2">{item.price ? item.price.toFixed(2) : '0.00'} €</span>
               <span className="font-bold text-red-600">{item.discountPrice.toFixed(2)} €</span>
             </>
           ) : (
             <span>{item.price ? item.price.toFixed(2) : '0.00'} €</span>
           )}
        </div>
        {item.externalStock && (
            <div className="text-tany-green text-sm mt-1">
                Skladom u dodávateľa
            </div>
        )}
        {item.quantity > 0 && !item.externalStock && (
            <div className="text-tany-green text-sm mt-1">
                Skladom
            </div>
        )}
      </div>

      {/* Quantity */}
      <div>
         <input
             type="number"
             min="1"
             value={quantity}
             onChange={(e) => setQuantity(e.target.value)}
             onBlur={handleUpdate}
             onKeyDown={handleKeyDown}
             disabled={updating}
             className="w-16 text-center"
             aria-label="Quantity"
         />
      </div>

      {/* Total */}
      <div className="font-bold w-20 text-right hidden sm:block">
         {((item.discountPrice || item.price) * item.quantity).toFixed(2)} €
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        disabled={updating}
        className="text-gray-400 hover:text-red-600 transition-colors"
        title="Odstrániť"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;
