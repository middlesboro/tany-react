import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import { getHomepageGrids } from '../services/homepageService';
import ProductCard from '../components/ProductCard';
import ImageSlider from '../components/ImageSlider';
import SeoHead from '../components/SeoHead';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [homepageGrids, setHomepageGrids] = useState([]);
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

  useEffect(() => {
    const fetchHomepageGrids = async () => {
      try {
        const data = await getHomepageGrids();
        if (data && data.homepageGrids) {
          setHomepageGrids(data.homepageGrids);
        }
      } catch (error) {
        console.error("Failed to fetch homepage grids", error);
      }
    };
    fetchHomepageGrids();
  }, []);

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0);
  };

  // Recommended Image Resolutions:
  // Desktop: 1600x350 px
  // Mobile: 800x400 px
  const slides = [
    {
      desktopUrl: 'https://ik.imagekit.io/8grotfwks/tany.sk_banner_henna_na_vlasy.jpg?updatedAt=1770369499232',
      mobileUrl: 'https://ik.imagekit.io/8grotfwks/tany.sk_banner_henna_na_vlasy_mobil.jpg?updatedAt=1770369499227',
      link: 'https://www.tany.sk/23-vlasova-kozmetika?q=Značka-Indian Natural Hair Care',
      title: 'Prírodná starostlivosť o vlasy',
      text: 'Predstavujeme Vám prírodné produkty a farby na vlasy Indian Natural Hair Care'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <SeoHead
        title="Prírodná kozmetika a henna na vlasy"
        description="Vaša obľúbená prírodná kozmetika a henna na vlasy."
      />
      <ImageSlider slides={slides} />

      {homepageGrids.map((grid) => (
        <div key={grid.id} className="mb-12">
          <div className="flex justify-between items-center mb-6 gap-4 border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold uppercase text-gray-800">{grid.title}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-l border-gray-100">
            {grid.products.map((product) => (
              <div key={product.id} className="p-2">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
};

export default Home;
