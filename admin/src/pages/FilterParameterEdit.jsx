import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFilterParameter, createFilterParameter, updateFilterParameter } from '../services/filterParameterAdminService';
import FilterParameterForm from '../components/FilterParameterForm';

const FilterParameterEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [filterParameter, setFilterParameter] = useState({
    name: '',
    type: '', // or default enum
    active: true,
    filterParameterValueIds: []
  });

  useEffect(() => {
    if (isEdit) {
      const fetchFilterParameter = async () => {
        try {
            const data = await getFilterParameter(id);
            setFilterParameter(data);
        } catch (error) {
            console.error("Failed to fetch filter parameter", error);
        }
      };
      fetchFilterParameter();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFilterParameter((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateFilterParameter(id, filterParameter);
      } else {
        await createFilterParameter(filterParameter);
      }
      navigate('/filter-parameters');
    } catch (error) {
      console.error('Failed to save filter parameter', error);
      alert('Failed to save filter parameter');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Filter Parameter' : 'Create Filter Parameter'}</h2>
      <FilterParameterForm
        filterParameter={filterParameter}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isEdit={isEdit}
      />
    </div>
  );
};

export default FilterParameterEdit;
