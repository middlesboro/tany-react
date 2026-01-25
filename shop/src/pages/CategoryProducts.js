import React, { useEffect, useState, useMemo } from 'react';
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

  // Data State
  const [category, setCategory] = useState(null);
  const [initialFacets, setInitialFacets] = useState(null); // Full list for parsing logic (null = not loaded)
  const [displayFacets, setDisplayFacets] = useState([]); // Current facets from API (with counts/state)
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // UI Options
  const [sort, setSort] = useState('BEST_SELLING');
  const [size, setSize] = useState(12);

  // Status
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [portalTarget, setPortalTarget] = useState(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('sidebar-filter-root'));
  }, []);

  // Derived State from URL
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const page = (pageParam > 0 ? pageParam : 1) - 1; // Internal 0-based
  const q = searchParams.get('q');

  const selectedFilters = useMemo(() => {
    // Only parse if we have the schema (initialFacets)
    if (!initialFacets) return {};
    return parseFilters(q, initialFacets);
  }, [q, initialFacets]);

  // 1. Initialization: Fetch Category and Initial Facets (Schema)
  useEffect(() => {
    const initCategory = async () => {
      setLoadingCategory(true);
      setError(null);
      setCategory(null);
      setInitialFacets(null); // Reset to null to block product fetch

      try {
        const categories = await getCategories();
        const foundCategory = findCategoryBySlug(categories, slug);

        if (!foundCategory) {
          setError("Kategória sa nenašla.");
          setLoadingCategory(false);
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

        // Fetch initial facets (empty search) to get the "Schema" for URL parsing
        // We use a dummy request
        const data = await searchProductsByCategory(foundCategory.id, { filterParameters: [], sort: 'BEST_SELLING' }, 0, 'BEST_SELLING', 1);

        // Always set initialFacets to array (even if empty) to signal loaded state
        const loadedFacets = data.filterParameters || [];
        setInitialFacets(loadedFacets);
        setDisplayFacets(loadedFacets);

      } catch (err) {
        console.error("Failed to init category", err);
        setError("Nepodarilo sa načítať kategóriu.");
      } finally {
        setLoadingCategory(false);
      }
    };

    initCategory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // 2. Fetch Products whenever criteria change
  useEffect(() => {
    // Only fetch if we have a category and the schema (initialFacets) is loaded (non-null)
    if (!category || initialFacets === null) return;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      // setError(null); // Don't clear category error if any
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

        // Update display facets if provided (to show counts or narrow options)
        if (data.filterParameters) {
            setDisplayFacets(data.filterParameters);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
        // Maybe set a local error state for product list, but keep category visible
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
    window.scrollTo(0, 0);
  }, [category, initialFacets, selectedFilters, page, sort, size]);


  // Handlers
  const handleFilterChange = (paramId, valueId, checked) => {
      // We must derive the *next* state based on current selectedFilters
      // selectedFilters is Memoized from URL, so it's the source of truth.

      const currentValues = selectedFilters[paramId] || [];
      let newValues;
      if (checked) {
          newValues = [...currentValues, valueId];
      } else {
          newValues = currentValues.filter(id => id !== valueId);
      }

      const nextFilters = { ...selectedFilters };
      if (newValues.length > 0) {
          nextFilters[paramId] = newValues;
      } else {
          delete nextFilters[paramId];
      }

      // Serialize and update URL
      // Always reset to page 1 (0) on filter change
      const newQ = serializeFilters(nextFilters, initialFacets);

      const newParams = {};
      if (newQ) newParams.q = newQ;
      // page 1 is default, omitted

      setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
      // newPage is 0-based
      const newParams = {};
      if (q) newParams.q = q;
      if (newPage > 0) newParams.page = newPage + 1;

      setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    // Sort does not reset page usually, but maybe it should?
    // User preference often is to keep page.
    // But for safety let's reset to 1 if sorting changes order drastically.
    // The previous code didn't reset page on sort. I'll keep it.
  };

  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    // Reset to page 1
    const newParams = {};
    if (q) newParams.q = q;
    setSearchParams(newParams);
  };

  if (loadingCategory) {
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
          filterParameters={displayFacets}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Desktop Filter Portal */}
      {isDesktop && portalTarget && createPortal(
        <CategoryFilter
          filterParameters={displayFacets}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />,
        portalTarget
      )}

          {loadingProducts && products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">Načítavam produkty...</div>
          ) : (
            <>
                {products.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">V tejto kategórii nie sú žiadne produkty.</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border-t border-l border-gray-100 opacity-transition">
                         {/* Simple opacity usage if loading but showing stale data?
                             For now, strict loading state. */}
                        {loadingProducts && (
                             <div className="absolute inset-0 bg-white bg-opacity-50 z-10 flex items-center justify-center">
                                 <span className="text-gray-500">Obnovujem...</span>
                             </div>
                        )}
                        {products.map((product) => (
                            <div key={product.id} className="p-2 relative">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-2 text-sm">
                    <button
                    onClick={() => handlePageChange(page - 1)}
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
                    onClick={() => handlePageChange(page + 1)}
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
