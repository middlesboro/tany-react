import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFilterParameterValue, createFilterParameterValue, updateFilterParameterValue } from '../services/filterParameterValueAdminService';
import FilterParameterValueForm from '../components/FilterParameterValueForm';

const FilterParameterValueEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [filterParameterValue, setFilterParameterValue] = useState({
    name: '',
    active: true
  });

  useEffect(() => {
    if (isEdit) {
      const fetchValue = async () => {
        try {
          const data = await getFilterParameterValue(id);
          setFilterParameterValue(data);
        } catch (error) {
          console.error("Failed to fetch filter parameter value", error);
        }
      };
      fetchValue();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFilterParameterValue((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateFilterParameterValue(id, filterParameterValue);
      } else {
        await createFilterParameterValue(filterParameterValue);
      }
      navigate('/admin/filter-parameter-values');
    } catch (error) {
      console.error('Failed to save filter parameter value', error);
      alert('Failed to save filter parameter value');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Filter Parameter Value' : 'Create Filter Parameter Value'}</h2>
      <FilterParameterValueForm
        filterParameterValue={filterParameterValue}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default FilterParameterValueEdit;
