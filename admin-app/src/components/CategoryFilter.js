import React from 'react';

const CategoryFilter = ({ filterParameters, selectedFilters, onChange }) => {
  const handleCheckboxChange = (paramId, valueId, checked) => {
    onChange(paramId, valueId, checked);
  };

  if (!filterParameters || filterParameters.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="text-lg font-bold mb-4 border-b pb-2">Filtre</h3>
      {filterParameters.map((param) => (
        <div key={param.id} className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">{param.name}</h4>
          <div className="space-y-2">
            {param.values && param.values.map((value) => {
                const isSelected = selectedFilters[param.id]?.has(value.id);
                return (
                    <label key={value.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={isSelected || false}
                        onChange={(e) => handleCheckboxChange(param.id, value.id, e.target.checked)}
                        className="form-checkbox h-4 w-4 text-tany-green border-gray-300 rounded focus:ring-tany-green"
                        />
                        <span className={`text-sm ${isSelected ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                        {value.name}
                        </span>
                    </label>
                );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryFilter;
