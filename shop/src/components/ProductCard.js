import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import AddToCartButton from './AddToCartButton';
import ProductLabel from './ProductLabel';
import { addToWishlist, removeFromWishlist } from '../services/wishlistService';
import { isAuthenticated } from '../services/authService';

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const { openLoginModal } = useModal();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [inWishlist, setInWishlist] = useState(product.inWishlist || false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    setInWishlist(product.inWishlist || false);
  }, [product.inWishlist]);

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

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      openLoginModal('Pre pridanie do obľúbených sa musíte prihlásiť.');
      return;
    }
    if (wishlistLoading) return;

    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        setInWishlist(false);
      } else {
        await addToWishlist(product.id);
        setInWishlist(true);
      }
    } catch (error) {
      console.error("Wishlist action failed", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="group bg-white flex flex-col h-full border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 relative">
        {/* Discount Badge Placeholder (example) */}
        {/* <span className="absolute top-2 left-2 bg-tany-red text-white text-xs font-bold px-2 py-1 z-10">-10%</span> */}

        {product.productLabels && product.productLabels.map((label, index) => (
            <ProductLabel key={index} label={label} />
        ))}

        <button
          onClick={toggleWishlist}
          className="absolute top-2 left-2 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-red-500 hover:text-red-600 transition-colors"
          title={inWishlist ? "Odobrať z obľúbených" : "Pridať do obľúbených"}
        >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill={inWishlist ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>

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

      <div className="p-2 md:p-4 flex flex-col flex-grow text-center">
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
             {product.quantity > 0 && (
               <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={adding}
                className="w-12 h-10 border border-gray-300 text-center text-sm focus:border-tany-green focus:outline-none"
              />
             )}
            <AddToCartButton
              onClick={handleAddToCart}
              adding={adding}
              text={product.quantity <= 0 ? "Vypredané" : "Do košíka"}
              disabled={product.quantity <= 0}
              className="h-10 px-4 flex-grow rounded-sm text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
