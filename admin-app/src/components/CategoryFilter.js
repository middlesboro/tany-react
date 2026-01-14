import React, { useState, useRef, useEffect } from 'react';

const FilterDropdown = ({ param, selectedFilters, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedCount = selectedFilters[param.id]?.size || 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-sm transition-colors ${
          isOpen || selectedCount > 0
            ? 'border-tany-green text-tany-green bg-green-50'
            : 'border-gray-300 text-gray-700 hover:border-gray-400'
        }`}
      >
        <span className="font-medium">{param.name}</span>
        {selectedCount > 0 && (
          <span className="bg-tany-green text-white text-xs px-1.5 py-0.5 rounded-full">
            {selectedCount}
          </span>
        )}
        <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-sm shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-3 space-y-2">
            {param.values && param.values.map((value) => {
              const isSelected = selectedFilters[param.id]?.has(value.id);
              return (
                <label key={value.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={isSelected || false}
                    onChange={(e) => onChange(param.id, value.id, e.target.checked)}
                    className="form-checkbox h-4 w-4 text-tany-green border-gray-300 rounded focus:ring-tany-green"
                  />
                  <span className={`text-sm ${isSelected ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                    {value.name}
                  </span>
                </label>
              );
            })}
            {(!param.values || param.values.length === 0) && (
                <div className="text-sm text-gray-500 text-center py-2">Žiadne možnosti</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CategoryFilter = ({ filterParameters, selectedFilters, onChange }) => {
  if (!filterParameters || filterParameters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filterParameters.map((param) => (
        <FilterDropdown
          key={param.id}
          param={param}
          selectedFilters={selectedFilters}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default CategoryFilter;
