import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCategories } from '../services/categoryService';
import { searchProductsByCategory } from '../services/productService';
import { findCategoryBySlug, findCategoryPath } from '../utils/categoryUtils';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

const CategoryProducts = () => {
  const { slug } = useParams();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [filterParameters, setFilterParameters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('title,asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch all categories to resolve slug to ID
        // We call getCategories() without args just to get the tree and find the ID.
        // We will use searchProductsByCategory for the actual filtering and facets.
        const categories = await getCategories();

        const foundCategory = findCategoryBySlug(categories, slug);

        if (!foundCategory) {
          setError("Kategória sa nenašla."); // Category not found
          setLoading(false);
          return;
        }

        // Breadcrumbs
        const path = findCategoryPath(categories, slug);
        if (path) {
           const crumbs = [
              { label: 'Domov', path: '/' },
              ...path.map(cat => ({
                  label: cat.title,
                  path: `/category/${cat.slug}`
              }))
           ];
           setBreadcrumbs(crumbs);
        }

        setCategory(foundCategory);

        // 2. Fetch products and filters for this category using the search endpoint
        // Prepare request object for filters
        const filterRequest = {
            filterParameters: Object.keys(selectedFilters).map(key => ({
                id: key,
                filterParameterValueIds: selectedFilters[key]
            }))
        };

        const data = await searchProductsByCategory(foundCategory.id, filterRequest, page, sort, size);

        // Handle response
        // data.products is a Page object (based on user snippet which maps result.getProducts())
        setProducts(data.products?.content || []);
        setTotalPages(data.products?.totalPages || 0);

        // data.filterParameters is the list of available filters
        if (data.filterParameters) {
            setFilterParameters(data.filterParameters);
        }

      } catch (err) {
        console.error("Failed to fetch category data", err);
        setError("Nepodarilo sa načítať produkty."); // Failed to load products
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug, page, sort, size, selectedFilters]); // Added selectedFilters dependency

  const handleFilterChange = (paramId, valueId, checked) => {
      setSelectedFilters(prev => {
          const currentValues = prev[paramId] || [];
          let newValues;
          if (checked) {
              newValues = [...currentValues, valueId];
          } else {
              newValues = currentValues.filter(id => id !== valueId);
          }

          const newState = { ...prev };
          if (newValues.length > 0) {
              newState[paramId] = newValues;
          } else {
              delete newState[paramId];
          }
          return newState;
      });
      setPage(0); // Reset page on filter change
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0);
  };

  if (loading && !category) {
      return <div className="text-center py-20 text-gray-500">Načítavam kategóriu...</div>;
  }

  if (error) {
      return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryFilter
        filterParameters={filterParameters}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-xl font-bold uppercase text-gray-800">{category?.title}</h1>

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
                {products.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">V tejto kategórii nie sú žiadne produkty.</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border-t border-l border-gray-100">
                        {products.map((product) => (
                            <div key={product.id} className="p-2">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}

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

export default CategoryProducts;
