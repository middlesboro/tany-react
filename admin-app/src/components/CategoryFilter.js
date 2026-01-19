import React from 'react';

const CategoryFilter = ({ filterParameters, selectedFilters, onFilterChange }) => {
  if (!filterParameters || filterParameters.length === 0) {
    return null;
  }

  const handleCheckboxChange = (paramId, valueId, checked) => {
    onFilterChange(paramId, valueId, checked);
  };

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-sm mb-6">
      <h3 className="font-bold uppercase text-gray-800 mb-4 text-sm">Filtrovať produkty</h3>
      <div className="flex flex-wrap gap-6">
        {filterParameters.map((param) => {
           // Skip rendering if no values are available
           if (!param.values || param.values.length === 0) return null;

           return (
            <div key={param.id} className="min-w-[150px]">
              <h4 className="font-bold text-gray-700 text-sm mb-2">{param.name}</h4>
              <ul className="space-y-1">
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
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
