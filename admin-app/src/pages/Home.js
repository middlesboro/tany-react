import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('title,asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(page, sort, size, false);
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, sort, size]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Sorting */}
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 font-medium">Sort by:</label>
          <select
            id="sort"
            value={sort}
            onChange={handleSortChange}
            className="border rounded p-2 bg-white"
          >
            <option value="title,asc">Title (A-Z)</option>
            <option value="title,desc">Title (Z-A)</option>
            <option value="price,asc">Price (Low to High)</option>
            <option value="price,desc">Price (High to Low)</option>
          </select>
        </div>

        {/* Page Size */}
        <div className="flex items-center">
          <label htmlFor="size" className="mr-2 font-medium">Show:</label>
          <select
            id="size"
            value={size}
            onChange={handleSizeChange}
            className="border rounded p-2 bg-white"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link to={`/products/${product.id}`} key={product.id} className="group border rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white flex flex-col">
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
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
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2 truncate group-hover:text-blue-600 transition-colors" title={product.title}>{product.title}</h3>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500 underline opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className={`px-4 py-2 rounded ${
                page === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page + 1 >= totalPages}
              className={`px-4 py-2 rounded ${
                page + 1 >= totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
