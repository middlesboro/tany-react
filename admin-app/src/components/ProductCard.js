import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AddToCartButton from './AddToCartButton';

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (cart && cart.products) {
      // Robust comparison: check both productId and id, using loose equality
      const cartItem = cart.products.find(item =>
        (item.productId && item.productId == product.id) ||
        (item.id && item.id == product.id)
      );

      if (cartItem) {
        setQuantity(cartItem.quantity);
      } else {
        setQuantity(1);
      }
    }
  }, [cart, product.id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      console.error("Failed to add to cart", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-white flex flex-col h-full border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 relative">
        {/* Discount Badge Placeholder (example) */}
        {/* <span className="absolute top-2 left-2 bg-tany-red text-white text-xs font-bold px-2 py-1 z-10">-10%</span> */}

      <Link to={`/products/${product.id}`} className="block relative overflow-hidden flex-shrink-0 aspect-square">
         {/* Overlay on hover not typically used in this specific prestashop theme, but image zoom/swap is common.
             We keep it simple but cleaner. */}
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-contain p-4 transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
               No Image
           </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow text-center">
        <Link to={`/products/${product.id}`} className="block mb-2">
          <h3 className="text-sm font-normal text-gray-800 hover:text-tany-green transition-colors leading-relaxed h-10 overflow-hidden" title={product.title}>
              {product.title}
          </h3>
        </Link>

        <div className="mt-auto flex flex-col items-center w-full">
          <div className="mb-3 text-lg font-bold text-gray-900 group-hover:text-tany-red transition-colors">
             {product.price.toFixed(2)} €
          </div>

          {/* Add to Cart Section - Always visible */}
          <div className="w-full flex items-center justify-center gap-2">
             <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={adding}
              className="w-12 h-10 border border-gray-300 text-center text-sm focus:border-tany-green focus:outline-none"
            />
            <AddToCartButton
              onClick={handleAddToCart}
              adding={adding}
              text="Do košíka"
              className="h-10 px-4 flex-grow rounded-sm text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
