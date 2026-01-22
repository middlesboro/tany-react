import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import ImageSlider from '../components/ImageSlider';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12); // Use 12 to fit 3 or 4 columns nicely
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('title,asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(page, sort, size);
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

  const slides = [
    {
      url: 'https://www.tany.sk/themes/leo_tea/assets/img/modules/appagebuilder/images/1.jpg',
      link: 'https://www.tany.sk/23-vlasova-kozmetika?q=Značka-Indian Natural Hair Care'
    },
    {
      url: 'https://www.tany.sk/themes/leo_tea/assets/img/modules/appagebuilder/images/3.jpg',
      link: 'https://www.tany.sk/244-tuli-a-tuli'
    },
    {
      url: 'https://www.tany.sk/themes/leo_tea/assets/img/modules/appagebuilder/images/2.jpg',
      link: 'https://www.tany.sk/99_ponio'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <ImageSlider slides={slides} />

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-xl font-bold uppercase text-gray-800">Všetky produkty</h1>

        <div className="flex gap-4">
            {/* Sorting */}
            <div className="flex items-center text-sm">
            <label htmlFor="sort" className="mr-2 text-gray-600">Zoradiť podľa:</label>
            <select
                id="sort"
                value={sort}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-sm p-1 text-gray-700 focus:outline-none focus:border-tany-green"
            >
                <option value="title,asc">Názov (A-Z)</option>
                <option value="title,desc">Názov (Z-A)</option>
                <option value="price,asc">Cena (od najlacnejšieho)</option>
                <option value="price,desc">Cena (od najdrahšieho)</option>
            </select>
            </div>

            {/* Page Size */}
            <div className="flex items-center text-sm">
            <label htmlFor="size" className="mr-2 text-gray-600">Zobraziť:</label>
            <select
                id="size"
                value={size}
                onChange={handleSizeChange}
                className="border border-gray-300 rounded-sm p-1 text-gray-700 focus:outline-none focus:border-tany-green"
            >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
            </select>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Načítavam produkty...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border-t border-l border-gray-100">
             {/* Using gap-0 and border logic to create a grid with borders between items if desired,
                 or standard gap. tany.sk often has distinct cards.
                 Let's stick to standard gap for cleaner responsive behavior but use the card's internal borders.
              */}
              {products.map((product) => (
                 <div key={product.id} className="p-2">
                    <ProductCard product={product} />
                 </div>
              ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2 text-sm">
                <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className={`px-3 py-2 rounded-sm border ${
                    page === 0
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-tany-green hover:text-white hover:border-tany-green'
                }`}
                >
                Predchádzajúca
                </button>
                <span className="text-gray-700 font-bold mx-2">
                Strana {page + 1} z {totalPages}
                </span>
                <button
                onClick={() => setPage(page + 1)}
                disabled={page + 1 >= totalPages}
                className={`px-3 py-2 rounded-sm border ${
                    page + 1 >= totalPages
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-tany-green hover:text-white hover:border-tany-green'
                }`}
                >
                Ďalšia
                </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
