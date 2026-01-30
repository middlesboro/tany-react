import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHomepageGrid, createHomepageGrid, updateHomepageGrid } from '../services/homepageGridAdminService';
import { getBrands } from '../services/brandAdminService';
import { getCategories } from '../services/categoryAdminService';
import { getAdminProducts } from '../services/productAdminService';
import HomepageGridForm from '../components/HomepageGridForm';

const HomepageGridEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [homepageGrid, setHomepageGrid] = useState({
    title: '',
    brandId: '',
    categoryId: '',
    productIds: [],
    resultCount: '',
    sortField: '',
    sortOrder: '',
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, categoriesData, productsData] = await Promise.all([
          getBrands(0, 'name,asc', 100),
          getCategories(0, 'title,asc', 1000), // Fetch more categories
          getAdminProducts(0, 'title,asc', 1000) // Fetch more products for selection
        ]);

        setBrands(brandsData.content);
        setCategories(categoriesData.content.map(c => ({ ...c, name: c.title })));
        setProducts(productsData.content.map(p => ({ ...p, name: p.title })));

        if (id) {
          const gridData = await getHomepageGrid(id);
          setHomepageGrid(gridData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setHomepageGrid({ ...homepageGrid, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateHomepageGrid(id, homepageGrid);
    } else {
      await createHomepageGrid(homepageGrid);
    }
    navigate('/homepage-grids');
  };

  const handleSaveAndStay = async () => {
    if (id) {
      await updateHomepageGrid(id, homepageGrid);
    } else {
      const newGrid = await createHomepageGrid(homepageGrid);
      navigate(`/homepage-grids/${newGrid.id}`, { replace: true });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Homepage Grid' : 'Create Homepage Grid'}</h1>
      <HomepageGridForm
        homepageGrid={homepageGrid}
        brands={brands}
        categories={categories}
        products={products}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSaveAndStay={handleSaveAndStay}
      />
    </div>
  );
};

export default HomepageGridEdit;
