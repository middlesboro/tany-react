import React, { useState, useEffect } from 'react';
import MultiSearchSelect from './MultiSearchSelect';
import { createFilterParameterValue, getFilterParameterValues } from '../services/filterParameterValueAdminService';

const FilterParameterForm = ({ filterParameter, handleChange, handleSubmit, isEdit }) => {
  const [allValues, setAllValues] = useState([]);
  const [showNewValueModal, setShowNewValueModal] = useState(false);
  const [newValueName, setNewValueName] = useState('');

  useEffect(() => {
    // Fetch all available filter parameter values for the multi-select
    // Assuming we can fetch all or search. For now fetch a decent page size or implement search in MultiSearchSelect
    // But MultiSearchSelect expects options.
    // Let's try to fetch a large number for now.
    const fetchValues = async () => {
        try {
            const data = await getFilterParameterValues(0, 'name,asc', 1000);
            setAllValues(data.content);
        } catch (error) {
            console.error("Failed to fetch filter parameter values", error);
        }
    };
    fetchValues();
  }, []);

  const handleValuesChange = (newValuesIds) => {
    // Manually trigger handleChange for the 'filterParameterValueIds' field
    handleChange({
        target: {
            name: 'filterParameterValueIds',
            value: newValuesIds,
            type: 'custom' // just to differentiate if needed, though handleChange in parent likely handles it by name/value
        }
    });
  };

  const handleCreateValue = async () => {
      if (!newValueName.trim()) return;
      try {
          const payload = { name: newValueName, active: true };
          if (filterParameter.id) {
            payload.filterParameterId = filterParameter.id;
          }
          const newValue = await createFilterParameterValue(payload);
          setAllValues([...allValues, newValue]);

          // Also automatically add it to the current filter parameter
          const currentIds = filterParameter.filterParameterValueIds || [];
          handleValuesChange([...currentIds, newValue.id]);

          setNewValueName('');
          setShowNewValueModal(false);
      } catch (error) {
          console.error("Failed to create value", error);
          alert("Failed to create value");
      }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={filterParameter.name || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700">Type</label>
          <select
            id="type"
            name="type"
            value={filterParameter.type || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Type</option>
            {/* Adjust these types based on actual Enum in backend */}
            <option value="AVAILABILITY">AVAILABILITY</option>
            <option value="TAG">TAG</option>
             {/* Add other types if known */}
          </select>
        </div>

        <div className="mb-4">
            <label className="flex items-center">
                <input
                    type="checkbox"
                    name="active"
                    checked={filterParameter.active || false}
                    onChange={handleChange}
                    className="mr-2"
                />
                Active
            </label>
        </div>

        {/* Value Selection - Only enabled/visible if not creating new parameter, OR user logic says:
             "this option to create new filter value will be accessible just when filter param is already created, because we need id."
             Wait, assigning EXISTING values should be possible always? Or does the backend link them?
             Usually linking is done on the owning side. If FilterParameter owns the relationship (List<String> filterParameterValueIds),
             then we can assign existing values even on creation, provided we have their IDs.

             BUT creating NEW values requires the context?
             Actually, `createFilterParameterValue` just takes `{name, active}`. It doesn't seem to depend on FilterParameter ID in the DTO provided.
             "create a new filter value will be accessible just when filter param is already created, because we need id"
             This part of the prompt is slightly confusing if FilterParameterValue is independent.
             Maybe the user means they want to associate it immediately?

             Let's stick to the prompt: "this option to create new filter value will be accessible just when filter param is already created"
        */}

        <div className="mb-4">
             <div className="flex justify-between items-end mb-1">
                 <label className="block text-gray-700">Filter Parameter Values</label>
                 {isEdit && (
                     <button
                        type="button"
                        onClick={() => setShowNewValueModal(true)}
                        className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
                     >
                         + Create New Value
                     </button>
                 )}
             </div>
             <MultiSearchSelect
                label=""
                options={allValues.map(v => ({ id: v.id, name: v.name }))}
                value={filterParameter.filterParameterValueIds || []}
                onChange={handleValuesChange}
                placeholder="Select values..."
             />
             {!isEdit && (
                 <p className="text-sm text-gray-500 mt-1">Save the parameter first to create new values.</p>
             )}
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>

      {/* Simple Modal for New Value */}
      {showNewValueModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                  <h3 className="text-lg font-bold mb-4">Create New Value</h3>
                  <input
                    type="text"
                    value={newValueName}
                    onChange={(e) => setNewValueName(e.target.value)}
                    placeholder="Value Name"
                    className="w-full px-3 py-2 border rounded mb-4"
                  />
                  <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowNewValueModal(false)}
                        className="px-4 py-2 bg-gray-300 rounded"
                      >
                          Cancel
                      </button>
                      <button
                        onClick={handleCreateValue}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                      >
                          Create
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default FilterParameterForm;
