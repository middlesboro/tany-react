import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBrands } from '../services/brandService';
import { removeDiacritics, customEncode } from '../utils/filterUrlUtils';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands(0, 100); // Fetch up to 100 brands
        // Assuming data.content is the array. If the API returns a list directly, we handle that too.
        const brandList = data.content || (Array.isArray(data) ? data : []);
        // Filter active brands if the 'active' property exists
        const activeBrands = brandList.filter(b => b.active !== false);
        setBrands(activeBrands);
      } catch (err) {
        console.error("Failed to fetch brands", err);
        setError("Nepodarilo sa načítať značky.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-8 text-center text-gray-600">Načítavam...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Ponúkané značky</h1>
      {brands.length === 0 ? (
        <p className="text-center text-gray-500">Momentálne neponúkame žiadne značky.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/category/vsetky-produkty?q=Brand-${customEncode(removeDiacritics(brand.name))}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center justify-center h-full"
            >
               <div className="w-full h-32 flex items-center justify-center mb-4 overflow-hidden p-2">
                 {brand.image ? (
                   <img
                     src={brand.image}
                     alt={brand.name}
                     className="max-w-full max-h-full object-contain"
                   />
                 ) : (
                   <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 rounded">
                     <span className="text-xs">Bez obrázku</span>
                   </div>
                 )}
               </div>
               <h3 className="text-lg font-bold text-gray-800 text-center">{brand.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Brands;
