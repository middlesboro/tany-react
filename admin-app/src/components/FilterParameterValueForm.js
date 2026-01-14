import React from 'react';
import SearchSelect from './SearchSelect';

const FilterParameterValueForm = ({ filterParameterValue, handleChange, handleSubmit, filterParameters }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        {filterParameters && (
          <SearchSelect
            label="Filter Parameter"
            options={filterParameters.map(p => ({ id: p.id, name: p.name }))}
            value={filterParameterValue.filterParameterId || ''}
            onChange={(val) => handleChange({ target: { name: 'filterParameterId', value: val } })}
            placeholder="Select Filter Parameter"
          />
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={filterParameterValue.name || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="active"
            checked={filterParameterValue.active || false}
            onChange={handleChange}
            className="mr-2"
          />
          Active
        </label>
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
};

export default FilterParameterValueForm;
