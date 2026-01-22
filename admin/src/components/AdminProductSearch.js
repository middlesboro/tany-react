import React, { useState, useEffect, useRef } from 'react';
import { searchProducts } from '../services/productAdminService';

const AdminProductSearch = ({ onSelect }) => {
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
    }, 300); // Debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleProductClick = (product) => {
    if (onSelect) {
      onSelect(product);
    }
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="w-full relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products to assign..."
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
        />

        {/* Results Dropdown */}
        {showResults && (results.length > 0 || isLoading) && (
          <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded max-h-60 overflow-y-auto w-full">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : (
              <ul>
                {results.map((product) => (
                  <li key={product.id}>
                    <button
                      onClick={() => handleProductClick(product)}
                      type="button"
                      className="w-full text-left p-2 hover:bg-gray-100 flex items-center space-x-3 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="text-xs text-gray-400">No Img</div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-medium text-sm text-gray-800 truncate">{product.title}</div>
                        <div className="text-xs text-gray-500 truncate">{product.sku || `ID: ${product.id}`}</div>
                      </div>
                      <div className="text-sm font-bold text-gray-700 whitespace-nowrap ml-2">
                        {product.price ? `${product.price.toFixed(2)} €` : ''}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* No Results Message */}
        {showResults && !isLoading && results.length === 0 && query.length >= 3 && (
            <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded p-4 text-center text-gray-500 w-full">
                No results found
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductSearch;
