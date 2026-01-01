import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      // Optional: Show success message or toast
    } catch (error) {
      console.error("Failed to add to cart", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group border rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white flex flex-col">
      <Link to={`/products/${product.id}`} className="block h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>

        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-semibold mb-2 truncate group-hover:text-blue-600 transition-colors" title={product.title}>{product.title}</h3>
        </Link>

        <div className="mt-auto">
          <div className="mb-3 text-xl font-bold text-blue-600">
             {product.price.toFixed(2)} €
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={adding}
              className="w-16 border rounded px-2 py-1 text-center disabled:bg-gray-100 disabled:text-gray-400"
            />
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`flex-1 px-4 py-2 text-white text-sm rounded transition-colors ${
                adding ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
