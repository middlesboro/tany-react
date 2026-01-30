import React, { useState, useEffect, useRef } from 'react';
import { searchProducts } from '../services/productAdminService';

const OrderCreateItems = ({ items, onAddItem, onRemoveItem, onUpdateItem }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length >= 3) {
        setIsLoading(true);
        try {
          const data = await searchProducts(query);
          setResults(data);
          setShowResults(true);
        } catch (error) {
          console.error("Failed to search products", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleProductSelect = (product) => {
    onAddItem({
      id: product.id,
      name: product.title,
      quantity: 1,
      image: product.images && product.images.length > 0 ? product.images[0] : null,
      price: product.price,
      stockQuantity: product.quantity
    });
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Items</h3>

      {/* Search Input */}
      <div className="relative" ref={searchRef}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products to add..."
          className="w-full px-3 py-2 border rounded"
        />
        {/* Results Dropdown */}
        {showResults && (results.length > 0 || isLoading) && (
          <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-center text-gray-500">Loading...</div>
            ) : (
              <ul>
                {results.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => handleProductSelect(product)}
                      className="w-full text-left p-2 hover:bg-gray-100 flex items-center space-x-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs text-gray-500">No Img</span>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-sm">{product.title}</div>
                        <div className="text-xs text-gray-500">{product.price ? `${product.price.toFixed(2)} €` : ''}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {showResults && !isLoading && results.length === 0 && query.length >= 3 && (
             <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded p-3 text-center text-gray-500">
                No results found
            </div>
        )}
      </div>

      {/* Added Items List */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded border">
            <div className="flex items-center space-x-3">
               <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-500">No Img</span>
                  )}
               </div>
               <div>
                 <div className="font-medium">{item.name}</div>
                 {item.stockQuantity !== undefined && (
                   <div className="text-xs text-gray-500">
                     Stock: {item.stockQuantity}
                   </div>
                 )}
               </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Qty:</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onUpdateItem(index, { ...item, quantity: parseInt(e.target.value) || 1 })}
                  className="w-16 px-2 py-1 border rounded text-right"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemoveItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
            <div className="text-center text-gray-500 py-4 italic">
                No items added yet.
            </div>
        )}
      </div>
    </div>
  );
};

export default OrderCreateItems;
