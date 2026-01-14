import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getCategories, filterCategories } from '../services/categoryService';
import { getProductsByCategory } from '../services/productService';
import { findCategoryBySlug } from '../utils/categoryUtils';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';

const CategoryProducts = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('title,asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filterParameters, setFilterParameters] = useState([]);
  // selectedFilters: Map<paramId, Set<valueId>>
  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch all categories to resolve slug to ID
        const categories = await getCategories();
        const foundCategory = findCategoryBySlug(categories, slug);

        if (!foundCategory) {
          setError("Kategória sa nenašla.");
          setLoading(false);
          return;
        }

        setCategory(foundCategory);

        if (foundCategory.filterParameters) {
            setFilterParameters(foundCategory.filterParameters);
        } else {
            setFilterParameters([]);
        }
        setSelectedFilters({}); // Reset selection on category change

        // 2. Fetch products for this category (initially without filters)
        // We set initial params to match default state (page 0, etc)
        // But since we have a dedicated effect for fetching data based on dependencies,
        // we might not need to fetch here IF that effect runs.
        // However, the dedicated effect has a check for isFirstRun.
        // So we do initial fetch here.
        const data = await getProductsByCategory(foundCategory.id, 0, 'title,asc', 12, []);
        setProducts(data.content);
        setTotalPages(data.totalPages);

        // Reset local state to defaults to match
        setPage(0);
        setSize(12);
        setSort('title,asc');

      } catch (err) {
        console.error("Failed to fetch category data", err);
        setError("Nepodarilo sa načítať produkty.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  const fetchFilteredData = useCallback(async (currentCategory, currentSelectedFilters, currentPage, currentSort, currentSize) => {
    if (!currentCategory) return;

    setLoading(true);
    try {
        const filterRequest = Object.entries(currentSelectedFilters)
            .filter(([_, values]) => values.size > 0)
            .map(([paramId, values]) => ({
                id: paramId,
                filterParameterValueIds: Array.from(values)
            }));

        const data = await getProductsByCategory(currentCategory.id, currentPage, currentSort, currentSize, filterRequest);
        setProducts(data.content);
        setTotalPages(data.totalPages);

        if (filterRequest.length > 0) {
            const updatedFilters = await filterCategories(currentCategory.id, { filterParameters: filterRequest });
            setFilterParameters(updatedFilters);
        } else {
            // If filters are cleared, we might want to reset to original category filters
            // or fetch default state.
             const updatedFilters = await filterCategories(currentCategory.id, { filterParameters: [] });
             setFilterParameters(updatedFilters);
        }

    } catch (err) {
        console.error("Failed to fetch filtered data", err);
    } finally {
        setLoading(false);
    }
  }, []);

  const isFirstRun = React.useRef(true);

  // Unified effect for data fetching
  useEffect(() => {
    // Skip the first run because initial load is handled by the slug effect
    if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
    }

    if (category) {
        fetchFilteredData(category, selectedFilters, page, sort, size);
    }
  }, [page, sort, size, selectedFilters, category, fetchFilteredData]);

  const handleFilterChange = (paramId, valueId, checked) => {
      // Use functional update to ensure we work with latest state if needed,
      // but here we have selectedFilters in scope.
      // Crucial: Create DEEP COPY for Sets
      const newSelectedFilters = { ...selectedFilters };

      // Ensure we have a new Set instance for the specific param
      if (newSelectedFilters[paramId]) {
          newSelectedFilters[paramId] = new Set(newSelectedFilters[paramId]);
      } else {
          newSelectedFilters[paramId] = new Set();
      }

      if (checked) {
          newSelectedFilters[paramId].add(valueId);
      } else {
          newSelectedFilters[paramId].delete(valueId);
          if (newSelectedFilters[paramId].size === 0) {
              delete newSelectedFilters[paramId];
          }
      }

      // Update state
      setSelectedFilters(newSelectedFilters);
      // Reset page to 0.
      // NOTE: setting page to 0 will trigger the useEffect because 'page' is a dependency.
      // If page was already 0, it won't change, so we rely on 'selectedFilters' being a dependency too.
      // The useEffect listens to [page, sort, size, selectedFilters].
      // So modifying selectedFilters triggers it.
      // Modifying page triggers it.
      // If we modify both, React batching usually handles it, but if page changes, we get one run.
      // If page is already 0, only selectedFilters changes -> one run.
      // If page is 1, page becomes 0 -> both change -> one run (batched).
      setPage(0);
  };


  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0);
  };

  if (loading && !products.length && !category) {
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

      <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="w-full md:w-1/4">
             <CategoryFilter
                filterParameters={filterParameters}
                selectedFilters={selectedFilters}
                onChange={handleFilterChange}
             />
          </div>

          {/* Product Grid */}
          <div className="w-full md:w-3/4">
            {loading && products.length === 0 ? (
                <div className="text-center py-20 text-gray-500">Načítavam produkty...</div>
            ) : (
                <>
                    {products.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">V tejto kategórii nie sú žiadne produkty vyhovujúce filtrom.</div>
                    ) : (
                        <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-gray-100 ${loading ? 'opacity-50' : ''}`}>
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
      </div>
    </div>
  );
};

export default CategoryProducts;
