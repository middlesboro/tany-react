import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CategoryTreeItem = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <li className="border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between hover:bg-gray-50 transition-colors">
        <Link
          to={`/category/${category.slug}`}
          className="block py-3 px-4 text-sm text-gray-700 hover:text-tany-green flex-grow"
        >
          {category.title}
        </Link>
        {hasChildren && (
          <button
            onClick={handleToggle}
            className="py-3 px-4 text-gray-500 hover:text-tany-green focus:outline-none font-bold"
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
        {/* Static "All Products" link */}
        <li className="border-b border-gray-100">
          <Link
            to="/"
            className="block py-3 px-4 text-sm hover:text-tany-green hover:bg-gray-50 transition-colors font-bold"
          >
            Všetky produkty
          </Link>
        </li>

        {/* Dynamic Categories */}
        {categories.map((category) => (
          <CategoryTreeItem key={category.id} category={category} />
        ))}
      </ul>
    </div>
  );
};

export default CategoryTree;
