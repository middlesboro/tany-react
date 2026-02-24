import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileCategoryItem = ({ category, onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasChildren = category.children && category.children.length > 0;

  const isActive = location.pathname === `/kategoria/${category.slug}`;
  // Use useMemo to prevent recalculation on every render
  const isSale = useMemo(() => ['výpredaj', 'vypredaj'].includes(category.title.toLowerCase()), [category.title]);

  // Check for active descendants to auto-expand
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
      <div className={`flex items-center justify-between ${isActive ? 'bg-gray-50' : ''}`}>
        <Link
          to={`/kategoria/${category.slug}`}
          className={`block py-3 px-4 flex-grow text-sm ${
            isSale
              ? 'bg-red-600 text-white font-bold hover:bg-red-700'
              : isActive
              ? 'font-bold text-tany-green'
              : 'text-gray-700 hover:text-tany-green'
          }`}
          onClick={onLinkClick}
        >
          {category.title}
        </Link>
        {hasChildren && (
          <button
            onClick={handleToggle}
            className={`py-3 px-4 focus:outline-none font-bold ${isActive ? 'text-tany-green' : 'text-gray-500 hover:text-tany-green'}`}
          >
            {isOpen ? '−' : '+'}
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <ul className="pl-4 bg-gray-50 border-t border-gray-100">
          {category.children.map((child) => (
            <MobileCategoryItem key={child.id} category={child} onLinkClick={onLinkClick} />
          ))}
        </ul>
      )}
    </li>
  );
};

const MobileCategoryMenu = ({ categories, onLinkClick }) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-col">
      {categories.map((category) => (
        <MobileCategoryItem key={category.id} category={category} onLinkClick={onLinkClick} />
      ))}
    </ul>
  );
};

export default MobileCategoryMenu;
