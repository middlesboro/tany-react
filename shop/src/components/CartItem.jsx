import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import { logRemoveFromCart } from '../utils/analytics';

const CartItem = ({ item, crossSellProducts }) => {
  const { addToCart, removeFromCart } = useCart();
  const { openMessageModal } = useModal();
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);
  const [addingCrossSell, setAddingCrossSell] = useState(null);

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

  const handleAddCrossSell = async (product) => {
      setAddingCrossSell(product.id);
      try {
          await addToCart(product.id, 1);
      } catch (error) {
           if (error.status === 400) {
              openMessageModal("Upozornenie", "Produkt nie je na sklade.");
           } else {
              console.error("Failed to add cross-sell item", error);
           }
      } finally {
          setAddingCrossSell(null);
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
    <div className="product !flex-col !items-start">
      <div className="w-full flex gap-4 items-start sm:items-center">
          {/* Image */}
          <div className="shrink-0">
             {displayImage ? (
                <img src={displayImage} alt={displayName} className="!w-20 !h-20 object-cover rounded-lg" />
             ) : (
                <div className="w-20 h-20 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No Img</div>
             )}
          </div>

          {/* Details & Controls Wrapper */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between min-w-0">
            {/* Info */}
            <div className="flex-1 pr-0 sm:pr-4">
              <Link to={`/produkt/${item.slug}`} className="block font-bold text-gray-800 hover:text-[#2f6f4f] no-underline mb-1 break-words">
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

            {/* Controls */}
            <div className="mt-3 sm:mt-0 flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
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

               {/* Total - Desktop Only */}
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
          </div>
      </div>

      {/* Cross-Sell Section */}
      {crossSellProducts && crossSellProducts.length > 0 && (
          <div className="max-w-full mt-3 sm:pl-0 overflow-hidden">
              <div className="text-xs font-semibold text-gray-500 mb-2">Odporúčame dokúpiť:</div>
              <div className="flex flex-col gap-2">
                  {crossSellProducts.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex gap-3 items-start sm:items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                          {/* Small Image */}
                          <div className="shrink-0">
                              {product.image ? (
                                  <img src={product.image} alt={product.title} className="w-10 h-10 object-cover rounded" />
                              ) : (
                                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-400">Img</div>
                              )}
                          </div>

                          {/* Title, Price & Button Wrapper */}
                          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between min-w-0 gap-2">
                              {/* Title & Price */}
                              <div className="flex-1 min-w-0">
                                  <Link to={`/produkt/${product.slug}`} className="text-xs font-medium text-gray-800 hover:text-[#2f6f4f] break-words whitespace-normal block" title={product.title}>
                                      {product.title}
                                  </Link>
                                  <div className="text-[10px] text-gray-500">
                                      {product.price ? product.price.toFixed(2) : '0.00'} €
                                  </div>
                              </div>

                              {/* Add Button */}
                              <div className="mt-1 sm:mt-0">
                                  <button
                                      onClick={() => handleAddCrossSell(product)}
                                      disabled={addingCrossSell === product.id}
                                      className="text-xs font-bold text-[#2f6f4f] border border-[#2f6f4f] hover:bg-[#2f6f4f] hover:text-white px-2 py-1 rounded transition-colors whitespace-nowrap"
                                  >
                                      {addingCrossSell === product.id ? '...' : '+ Pridať'}
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default CartItem;
