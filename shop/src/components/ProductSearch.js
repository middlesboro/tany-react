import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/productService';

const ProductSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

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
    navigate(`/product/${product.slug}`);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="flex-grow max-w-xl w-full mx-4" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hľadať v obchode..."
          className="w-full border border-gray-300 rounded-sm py-2 px-4 focus:outline-none focus:border-tany-green"
        />
        <button className="absolute right-0 top-0 h-full bg-tany-green text-white px-4 hover:bg-green-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Results Dropdown */}
        {showResults && (results.length > 0 || isLoading) && (
          <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-sm max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Načítavam...</div>
            ) : (
              <ul>
                {results.map((product) => (
                  <li key={product.id}>
                    <button
                      onClick={() => handleProductClick(product)}
                      className="w-full text-left p-2 hover:bg-gray-50 flex items-center space-x-3 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <div className="h-12 w-12 flex-shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                        ) : (
                          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-sm text-gray-800 line-clamp-1">{product.title}</div>
                      </div>
                      <div className="text-sm font-bold text-tany-green whitespace-nowrap">
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
            <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-sm p-4 text-center text-gray-500">
                Žiadne výsledky
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
