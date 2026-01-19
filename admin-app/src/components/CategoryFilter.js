import React, { useState } from 'react';

const CategoryFilter = ({ filterParameters, selectedFilters, onFilterChange }) => {
  // Initialize state for tracking expanded sections
  // We'll track expanded state by parameter ID.
  const [expandedSections, setExpandedSections] = useState({});

  if (!filterParameters || filterParameters.length === 0) {
    return null;
  }

  const handleCheckboxChange = (paramId, valueId, checked) => {
    onFilterChange(paramId, valueId, checked);
  };

  const toggleSection = (paramId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [paramId]: !prev[paramId],
    }));
  };

  return (
    <div className="flex flex-col gap-0 border-b border-gray-200 bg-white">
      <h3 className="font-bold uppercase text-gray-800 p-4 border-b border-gray-200">Filter</h3>

      {filterParameters.map((param) => {
        // Skip rendering if no values are available
        if (!param.values || param.values.length === 0) return null;

        // Determine if section is expanded. Default to collapsed (false) as requested "too long".
        const isExpanded = !!expandedSections[param.id];

        return (
          <div key={param.id} className="border-t border-gray-200 first:border-t-0">
            <button
              type="button"
              onClick={() => toggleSection(param.id)}
              className="w-full flex justify-between items-center py-4 px-2 hover:bg-gray-50 focus:outline-none"
            >
              <h4 className="font-bold text-gray-800 text-sm uppercase">{param.name}</h4>
              <span className="text-gray-500">
                {isExpanded ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </button>

            {isExpanded && (
              <div className="pb-4 px-2">
                <ul className="space-y-2">
                  {param.values.map((val) => {
                    const isChecked = selectedFilters[param.id]?.includes(val.id) || false;
                    return (
                      <li key={val.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`filter-${param.id}-${val.id}`}
                          checked={isChecked}
                          onChange={(e) => handleCheckboxChange(param.id, val.id, e.target.checked)}
                          className="h-4 w-4 text-tany-green focus:ring-tany-green border-gray-300 rounded"
                        />
                        <label htmlFor={`filter-${param.id}-${val.id}`} className="ml-2 text-sm text-gray-600 cursor-pointer hover:text-tany-green">
                          {val.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
