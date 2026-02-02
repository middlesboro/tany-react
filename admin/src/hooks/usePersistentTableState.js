import { useState, useEffect } from 'react';

const getInitialState = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const usePersistentTableState = (key, initialFilters = {}, defaultSort = 'id,asc', defaultSize = 10) => {
  const savedState = getInitialState(key, {});

  const [page, setPage] = useState(savedState.page ?? 0);
  const [size, setSize] = useState(savedState.size ?? defaultSize);
  const [sort, setSort] = useState(savedState.sort ?? defaultSort);
  const [appliedFilter, setAppliedFilter] = useState(savedState.appliedFilter ?? {});

  // Initialize filter inputs with applied filters so the UI reflects the active state
  const [filter, setFilter] = useState({
    ...initialFilters,
    ...appliedFilter,
  });

  useEffect(() => {
    localStorage.setItem(
      key,
      JSON.stringify({
        page,
        size,
        sort,
        appliedFilter,
      })
    );
  }, [key, page, size, sort, appliedFilter]);

  const handleFilterChange = (e) => {
     const { name, value } = e.target;
     setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = () => {
    setAppliedFilter(filter);
    setPage(0);
  };

  const handleClearFilter = () => {
    setFilter(initialFilters);
    setAppliedFilter({});
    setPage(0);
  };

  const handleSort = (field) => {
    const [currentField, currentDirection] = sort.split(',');
    if (currentField === field) {
      setSort(`${field},${currentDirection === 'asc' ? 'desc' : 'asc'}`);
    } else {
      setSort(`${field},asc`);
    }
  };

  return {
    page, setPage,
    size, setSize,
    sort, setSort, handleSort,
    filter, setFilter, handleFilterChange,
    appliedFilter, setAppliedFilter,
    handleFilterSubmit,
    handleClearFilter
  };
};

export default usePersistentTableState;
