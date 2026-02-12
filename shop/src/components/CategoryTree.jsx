import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

const CategoryTreeItem = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasChildren = category.children && category.children.length > 0;

  const isActive = location.pathname === `/kategoria/${category.slug}`;
  const isSale = ['výpredaj', 'vypredaj'].includes(category.title.toLowerCase());

  const hasActiveDescendant = useMemo(() => {
    const check = (cats) => {
      if (!cats) return false;
      return cats.some((c) => `/kategoria/${c.slug}` === location.pathname || check(c.children));
    };
    return check(category.children);
  }, [category.children, location.pathname]);

  useEffect(() => {
    if (hasActiveDescendant) {
      setIsOpen(true);
    }
  }, [hasActiveDescendant]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <li className="border-b border-gray-100 last:border-0">
      <div className={`flex items-center justify-between transition-colors ${isActive ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
        <Link
          to={`/kategoria/${category.slug}`}
          className={`block py-3 px-4 text-sm flex-grow ${
            isSale
              ? 'bg-red-600 text-white font-bold hover:bg-red-700'
              : isActive
              ? 'font-bold text-tany-green'
              : 'text-gray-700 hover:text-tany-green'
          }`}
        >
          {category.title}
        </Link>
        {hasChildren && (
          <button
            onClick={handleToggle}
            className="py-3 px-4 text-gray-500 hover:text-tany-green focus:outline-none font-bold flex-shrink-0"
          >
            {isOpen ? '−' : '+'}
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <ul className="pl-4 bg-gray-50 border-t border-gray-100">
          {category.children.map((child) => (
            <CategoryTreeItem key={child.id} category={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

const CategoryTree = ({ categories }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
      <div className="bg-tany-dark-grey text-white font-bold uppercase py-3 px-4">
        Kategórie
      </div>
      <ul className="flex flex-col border-t border-gray-100">
        {/* Dynamic Categories */}
        {categories.map((category) => (
          <CategoryTreeItem key={category.id} category={category} />
        ))}
      </ul>
    </div>
  );
};

export default CategoryTree;
