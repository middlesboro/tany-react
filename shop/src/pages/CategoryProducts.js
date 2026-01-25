import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getCategories } from '../services/categoryService';
import { searchProductsByCategory } from '../services/productService';
import { findCategoryBySlug, findCategoryPath } from '../utils/categoryUtils';
import { createPortal } from 'react-dom';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import useMediaQuery from '../hooks/useMediaQuery';
import { serializeFilters, parseFilters } from '../utils/filterUrlUtils';

const CategoryProductsContent = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [filterParameters, setFilterParameters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('BEST_SELLING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [portalTarget, setPortalTarget] = useState(null);
  const [isUrlInitialized, setIsUrlInitialized] = useState(false);

  useEffect(() => {
    // Wait for the portal target to exist
    setPortalTarget(document.getElementById('sidebar-filter-root'));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // Initialization Effect: Load Category and Parse URL
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const categories = await getCategories();
        const foundCategory = findCategoryBySlug(categories, slug);

        if (!foundCategory) {
          setError("Kategória sa nenašla.");
          setLoading(false);
          return;
        }

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

        // Check URL for filters
        const q = searchParams.get('q');
        const urlPage = searchParams.get('page');

        if (q) {
            // Fetch default filters to map names to IDs
            const data = await searchProductsByCategory(foundCategory.id, { filterParameters: [], sort }, 0, sort, size);

            if (data.filterParameters) {
                const initialFilters = parseFilters(q, data.filterParameters);
                setSelectedFilters(initialFilters);
                setFilterParameters(data.filterParameters);
            }
        }

        if (urlPage) {
            const p = parseInt(urlPage, 10);
            if (!isNaN(p) && p > 0) {
                setPage(p - 1);
            }
        }

        setIsUrlInitialized(true);
      } catch (err) {
        console.error("Failed to fetch category data", err);
        setError("Nepodarilo sa načítať produkty.");
        setLoading(false);
      }
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount per slug

  // Data Fetching Effect (after initialization)
  useEffect(() => {
    if (!isUrlInitialized || !category) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const filterRequest = {
            filterParameters: Object.keys(selectedFilters).map(key => ({
                id: key,
                filterParameterValueIds: selectedFilters[key]
            })),
            sort: sort
        };

        const data = await searchProductsByCategory(category.id, filterRequest, page, sort, size);

        setProducts(data.products?.content || []);
        setTotalPages(data.products?.totalPages || 0);

        // Update filters with available facets (unless we want to keep all options visible?)
        // Usually we update to show counts or narrow down.
        if (data.filterParameters) {
            setFilterParameters(data.filterParameters);
        }

      } catch (err) {
        console.error("Failed to fetch products", err);
        setError("Nepodarilo sa načítať produkty.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, isUrlInitialized, page, sort, size, selectedFilters]);

  // URL Sync Effect
  useEffect(() => {
    if (!isUrlInitialized) return;

    const newParams = {};
    const q = serializeFilters(selectedFilters, filterParameters);

    if (q) newParams.q = q;
    if (page > 0) newParams.page = page + 1;

    // Use replace: false (default push) to allow back button navigation history
    setSearchParams(newParams);
  }, [selectedFilters, page, isUrlInitialized, filterParameters, setSearchParams]);

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

  if (loading && !category && !isUrlInitialized) {
      return <div className="text-center py-20 text-gray-500">Načítavam kategóriu...</div>;
  }

  if (error && !category) {
      return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
              <option value="NAME_ASC">Názov (A-Z)</option>
              <option value="NAME_DESC">Názov (Z-A)</option>
              <option value="PRICE_ASC">Cena (od najlacnejšieho)</option>
              <option value="PRICE_DESC">Cena (od najdrahšieho)</option>
              <option value="BEST_SELLING">Najpredávanejšie</option>
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

      {/* Mobile Filter */}
      {!isDesktop && (
        <CategoryFilter
          filterParameters={filterParameters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Desktop Filter Portal */}
      {isDesktop && portalTarget && createPortal(
        <CategoryFilter
          filterParameters={filterParameters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />,
        portalTarget
      )}

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

const CategoryProducts = () => {
    const { slug } = useParams();
    return <CategoryProductsContent key={slug} />;
};

export default CategoryProducts;
